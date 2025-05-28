import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useEffect, useState} from "react";
import type {TrendingModel} from "@/components/types/TrendingModel.ts";
import {bookService} from "@/api/book.ts";
import {testTrending} from "@/trendingFixtures.ts";
import TrendingCard from "@/components/TrendingCard.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";

const TrendingPage: React.FC<{}> = () => {
    const { duration = "month" } = useParams();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const page = pageParam !== null ? Math.max(parseInt(pageParam), 1) : 1;

    const [trending, setTrending] = useState<TrendingModel[]>([])

    useEffect(() => {
        if (!duration) return

        getTrending();
    }, [duration, page]);

    const getTrending = async () => {
        // try {
        //     const response = await bookService.getTrending(duration, page);
        //     setTrending(response);
        // } catch (err) {
        //     console.error("Error fetching book details:", err);
        // }
        const response = testTrending
        setTrending(response)
    }

    const goToPage = (newPage: number) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
    };

    const handleTabChange = (newValue: string) => {
        navigate(`/trending/${newValue}`);
    };

    return (
        <div className="mt-30">
            <Tabs defaultValue={duration} onValueChange={handleTabChange}>
                <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b !bg-transparent p-0">
                    <TabsTrigger value="month" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Month
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        3 Months
                    </TabsTrigger>
                    <TabsTrigger value="year" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Year
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="month" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {trending.map((book) => (
                            <TrendingCard key={book.id} book={book}/>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="recent" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {trending.map((book) => (
                            <TrendingCard key={book.id} book={book}/>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="year" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {trending.map((book) => (
                            <TrendingCard key={book.id} book={book}/>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default TrendingPage;
