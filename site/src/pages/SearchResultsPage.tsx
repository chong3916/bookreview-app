import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {useSearchContext} from "@/contexts/SearchContext.tsx";
import BookCard from "@/components/BookCard.tsx";
import {testBookSearch} from "@/bookSearchFixtures.ts";
import PaginationControls from "@/components/PaginationControls.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {testAuthorSearch} from "@/authorSearchFixtures.ts";
import type {AuthorHit, BookHit, SearchResult} from "@/components/types/SearchResult.ts";
import AuthorCard from "@/components/AuthorCard.tsx";
import {bookService} from "@/api/book.ts";

const SearchResultsPage: React.FC<{}> = () => {
    const SEARCH_QUERY_TYPES = ["author", "book", "list", "publisher", "series", "user"];

    const [searchParams, setSearchParams] = useSearchParams();
    const { setSearchData } = useSearchContext();
    const query = searchParams.get("q") ?? "";
    const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);

    const [loading, setLoading] = useState<boolean>(false);

    let queryType = searchParams.get("type")?.toLowerCase() ?? "book"
    if (!SEARCH_QUERY_TYPES.includes(queryType)) {
        queryType = "book"; // fallback to default
    }

    const [results, setResults] = useState<SearchResult | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1)

    useEffect(() => {
        setSearchData({ query: query, page: page, queryType: queryType});
        getSearch();
    }, [query, page, queryType])

    const getSearch = async () => {
        try {
            setLoading(true);
            // const response = await bookService.getSearch(query, page, queryType);

            const response: SearchResult =
                queryType === "author"
                    ? { ...testAuthorSearch, type: "author" }
                    : { ...testBookSearch, type: "book" };

            setTotalPages(response.found ? Math.ceil(response.found / 25) : 1);
            setResults(response);
        } catch (e) {
            console.error("Search failed", e);
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (newPage: number) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
    };

    const handleTabChange = (newValue: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("type", newValue);
        setSearchParams(params);
    };

    const isAuthorHit = () => {
        return (hit: BookHit | AuthorHit): hit is AuthorHit => {
            return (hit as AuthorHit).document.books !== undefined;
        };
    };

    return (
        <div className="mt-30">
            <Tabs value={queryType} onValueChange={handleTabChange}>
                <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b !bg-transparent p-0">
                    <TabsTrigger value="book" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Books
                    </TabsTrigger>
                    <TabsTrigger value="author" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Authors
                    </TabsTrigger>
                    <TabsTrigger value="series" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Series
                    </TabsTrigger>
                    <TabsTrigger value="list" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Lists
                    </TabsTrigger>
                    <TabsTrigger value="publisher" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Publishers
                    </TabsTrigger>
                    <TabsTrigger value="user" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Users
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="book" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {loading ? (
                            <div className="text-center text-muted-foreground py-10">Loading...</div>
                        ) : (
                            results?.hits?.map((book) => (
                                <BookCard key={book.document.id} book={book.document} />
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="author" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {loading ? (
                            <div className="text-center text-muted-foreground py-10">Loading...</div>
                        ) : (
                            results?.hits?.filter(isAuthorHit()).map((author, index) => (
                                <AuthorCard key={index} author={author.document} />
                            )) ?? null
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="series" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {results?.hits?.map((book) => (
                            <BookCard key={book.document.id} book={book.document} />
                        )) ?? null }
                    </div>
                </TabsContent>

                <TabsContent value="list" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {results?.hits?.map((book) => (
                            <BookCard key={book.document.id} book={book.document} />
                        )) ?? null }
                    </div>
                </TabsContent>

                <TabsContent value="publisher" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {results?.hits?.map((book) => (
                            <BookCard key={book.document.id} book={book.document} />
                        )) ?? null }
                    </div>
                </TabsContent>

                <TabsContent value="user" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {results?.hits?.map((book) => (
                            <BookCard key={book.document.id} book={book.document} />
                        )) ?? null }
                    </div>
                </TabsContent>
            </Tabs>

            <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
            />
        </div>
    )
}

export default SearchResultsPage;
