import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {useSearchContext} from "@/contexts/SearchContext.tsx";
import type SearchBookResult from "@/components/types/SearchBookResult.ts";
import BookCard from "@/components/BookCard.tsx";
import {testBookSearch} from "@/fixtures.ts";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";


const SearchResultsPage: React.FC<{}> = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { setSearchData } = useSearchContext();
    const query = searchParams.get("q") ?? "";
    const title = searchParams.get("title") ?? "";
    const author = searchParams.get("author") ?? "";
    const subject = searchParams.get("subject") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1");

    const [results, setResults] = useState<SearchBookResult|null>(null);
    const [totalPages, setTotalPages] = useState<number>(1)

    useEffect(() => {
        setSearchData({ query: query, title: title, author: author, subject: subject, page: page });
        getSearch();
    }, [])

    const getSearch = async () => {
        try {
            // const response = await bookService.searchBook(query, title, author, subject, page);
            const response = testBookSearch;
            setResults(response);
            console.log(response);
            setTotalPages(response.found ? Math.ceil(response.found / 25) : 1)
        } catch (e) {
            console.error("Search failed", e);
        }
    }

    const goToPage = (newPage: number) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
    };

    const getPageNumbers = (current: number, total: number): (number | string)[] => {
        const delta = 1; // how many numbers to show around the current page
        const range: (number | string)[] = [];
        const rangeWithDots: (number | string)[] = [];
        let left = current - delta;
        let right = current + delta;

        if (left < 2) {
            left = 2;
            right = left + 2;
        }
        if (right >= total) {
            right = total - 1;
            left = right - 2;
        }

        range.push(1);
        for (let i = left; i <= right; i++) {
            if (i > 1 && i < total) range.push(i);
        }
        if (total > 1) range.push(total);

        for (let i = 0; i < range.length; i++) {
            if (i > 0) {
                const prev = range[i - 1] as number;
                const curr = range[i] as number;
                if (curr - prev > 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(range[i]);
        }

        return rangeWithDots;
    };

    const pagesToShow = getPageNumbers(page, totalPages);

    return (
        <div className="grid gap-y-8 py-10 mx-auto w-3/4">
            {results?.hits?.map((book) => (
                <BookCard key={book.document.id} book={book.document} />
            )) ?? null }

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) goToPage(page - 1);
                            }}
                            disabled={page === 1}
                        />
                    </PaginationItem>

                    {pagesToShow.map((p, index) => (
                        <PaginationItem key={index}>
                            {typeof p === "number" ? (
                                <PaginationLink
                                    href="#"
                                    aria-current={p === page ? "page" : undefined}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goToPage(p);
                                    }}
                                >
                                    {p}
                                </PaginationLink>
                            ) : (
                                <PaginationEllipsis />
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPages) goToPage(page + 1);
                            }}
                            disabled={page === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default SearchResultsPage;
