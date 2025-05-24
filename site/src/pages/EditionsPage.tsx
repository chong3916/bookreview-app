import {useParams, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import { bookService } from "@/api/book.ts";
import type EditionModel from "@/components/types/EditionModel.ts";
import {testEditions} from "../editionFixtures.ts";
import EditionCard from "@/components/EditionCard.tsx";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";


const EditionsPage: React.FC<{}> = () => {
    const {editionId} = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const page = pageParam !== null ? parseInt(pageParam) : 1;

    const [editions, setEditions] = useState<EditionModel[]>([])
    const [totalPages, setTotalPages] = useState<number>(1)

    useEffect(() => {
        if (!editionId) return;

        getEditions(editionId, page)
    }, [editionId, page])

    const getEditions = async (id: string, page: number) => {
        // try {
        //     const response = await bookService.getEditions(id, page);
        //     console.log(response)
        //     setEditions(response);
        // } catch (err) {
        //     console.error("Error fetching book details:", err);
        // }
        const response = testEditions
        setTotalPages(response[0].editions_count ? Math.ceil(response[0].editions_count / 10) : 1)
        setEditions(response)
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
            {editions.map((edition) => <EditionCard key={edition.id} edition={edition}/>)}
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

export default EditionsPage;
