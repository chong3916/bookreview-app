import React, {useEffect, useRef, useState} from "react";
import {useSearchParams} from "react-router";
import {useSearchContext} from "@/contexts/SearchContext.tsx";
import type SearchBookResult from "@/components/types/SearchBookResult.ts";
import BookCard from "@/components/BookCard.tsx";
import {testBookSearch} from "@/fixtures.ts";


const SearchResultsPage: React.FC<{}> = () => {
    const [params] = useSearchParams();
    const { setSearchData } = useSearchContext();
    const query = params.get("q") ?? "";
    const title = params.get("title") ?? "";
    const author = params.get("author") ?? "";
    const subject = params.get("subject") ?? "";
    const page = parseInt(params.get("page") ?? "1");

    const [results, setResults] = useState<SearchBookResult|null>(null);

    const hasRefreshed = useRef(false);

    useEffect(() => {
        if (hasRefreshed.current) return;
        hasRefreshed.current = true;

        setSearchData({ query: query, title: title, author: author, subject: subject, page: page });
        getSearch();
    }, [])

    const getSearch = async () => {
        try {
            // const response = await bookService.searchBook(query, title, author, subject, page);
            const response = testBookSearch;
            setResults(response);
            console.log(response);

        } catch (e) {
            console.error("Search failed", e);
        }
    }

    return (
        <div className="grid gap-y-8 py-10 mx-auto w-3/4">
            {results?.hits?.map((book) => (
                <BookCard key={book.document.id} book={book.document} />
            )) ?? null }
        </div>
    )
}

export default SearchResultsPage;
