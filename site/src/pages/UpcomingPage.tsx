import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useEffect, useState} from "react";
import {testUpcoming} from "@/upcomingFixtures.ts";
import {bookService} from "@/api/book.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import UpcomingCard from "@/components/UpcomingCard.tsx";
import type {UpcomingModel} from "@/components/types/UpcomingModel.ts";

const UpcomingPage: React.FC<{}> = () => {
    const { duration = "recent" } = useParams();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const page = pageParam !== null ? Math.max(parseInt(pageParam), 1) : 1;

    const [upcoming, setUpcoming] = useState<UpcomingModel[]>([])

    useEffect(() => {
        if (!duration) return

        getUpcoming();
    }, [duration, page]);

    const getUpcoming = async () => {
        // try {
        //     const response = await bookService.getUpcoming(duration, page);
        //     setUpcoming(response);
        // } catch (err) {
        //     console.error("Error fetching book details:", err);
        // }
        const response = testUpcoming
        setUpcoming(response)
    }

    const goToPage = (newPage: number) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
    };

    const handleTabChange = (newValue: string) => {
        navigate(`/upcoming/${newValue}`);
    };

    return (
        <div className="mt-30">
            <Tabs defaultValue={duration} onValueChange={handleTabChange}>
                <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b !bg-transparent p-0">
                    <TabsTrigger value="recent" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Recent
                    </TabsTrigger>
                    <TabsTrigger value="month" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Month
                    </TabsTrigger>
                    <TabsTrigger value="quarter" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
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

                <TabsContent value="recent" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {upcoming.map((book) => (
                            <UpcomingCard key={book.id} book={book}/>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="month" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {upcoming.map((book) => (
                            <UpcomingCard key={book.id} book={book}/>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="quarter" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {upcoming.map((book) => (
                            <UpcomingCard key={book.id} book={book}/>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="year" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {upcoming.map((book) => (
                            <UpcomingCard key={book.id} book={book}/>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default UpcomingPage;
