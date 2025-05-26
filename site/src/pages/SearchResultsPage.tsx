import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {useSearchContext} from "@/contexts/SearchContext.tsx";
import type SearchBookResult from "@/components/types/SearchBookResult.ts";
import BookCard from "@/components/BookCard.tsx";
import {testBookSearch} from "@/fixtures.ts";
import PaginationControls from "@/components/PaginationControls.tsx";


const SearchResultsPage: React.FC<{}> = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { setSearchData } = useSearchContext();
    const query = searchParams.get("q") ?? "";
    const title = searchParams.get("title") ?? "";
    const author = searchParams.get("author") ?? "";
    const subject = searchParams.get("subject") ?? "";
    const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);

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
            setTotalPages(response.found ? Math.ceil(response.found / 25) : 1)
            setResults(response);
        } catch (e) {
            console.error("Search failed", e);
        }
    }

    const goToPage = (newPage: number) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
    };

    return (
        <div className="grid gap-y-8 py-10 mx-auto w-3/4">
            {results?.hits?.map((book) => (
                <BookCard key={book.document.id} book={book.document} />
            )) ?? null }

            <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
            />
        </div>
    )
}

export default SearchResultsPage;
