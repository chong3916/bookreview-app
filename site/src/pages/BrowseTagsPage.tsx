import {Link, useNavigate, useParams, useSearchParams} from "react-router";
import {Separator} from "@/components/ui/separator.tsx";
import React, {useEffect, useState} from "react";
import type {BasicTagModel} from "@/components/types/GenreModel.ts";
import {testAllGenres, testAllMoods, testAllTags} from "@/browseFixtures.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {bookService} from "@/api/book.ts";

const BrowseTagsPage: React.FC<{}> = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { browseType = "genres" } = useParams();
    const pageParam = searchParams.get("page");
    const page = pageParam !== null ? Math.max(parseInt(pageParam), 1) : 1;
    const [tags, setTags] = useState<BasicTagModel[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!browseType) return
        else if (browseType.toLowerCase() === "moods") getAllMoods();
        else if (browseType.toLowerCase() === "tags") getAllTags();
        else getAllGenres();
    }, [browseType, page])

    const getAllGenres = async () => {
        setLoading(true);
        try {
            // const response = await bookService.getAllGenres(page);
            // setTags(response);
            setTags(testAllGenres);
        } catch (err) {
            console.error("Error fetching genres:", err);
        } finally {
            setLoading(false);
        }
    }

    const getAllMoods = async () => {
        setLoading(true);
        try {
            // const response = await bookService.getAllMoods(page);
            // setTags(response);
            setTags(testAllMoods);
        } catch (err) {
            console.error("Error fetching moods:", err);
        } finally {
            setLoading(false);
        }
    }

    const getAllTags = async () => {
        setLoading(true);
        try {
            // const response = await bookService.getAllTags(page);
            // setTags(response);
            setTags(testAllTags);
        } catch (err) {
            console.error("Error fetching tags:", err);
        } finally {
            setLoading(false);
        }
    }

    const goToPage = (newPage: number) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
    };

    const handleTabChange = (newValue: string) => {
        navigate(`/browse/${newValue}`);
    };

    return (
        <div className="mt-30">
            <Tabs defaultValue={browseType.toLowerCase()} onValueChange={handleTabChange}>
                <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b !bg-transparent p-0">
                    <TabsTrigger value="genres" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Genres
                    </TabsTrigger>
                    <TabsTrigger value="moods" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Moods
                    </TabsTrigger>
                    <TabsTrigger value="tags" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                        Tags
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="genres" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {loading ? (
                            <div className="text-center text-muted-foreground py-10">Loading...</div>
                        ) : (tags.map((genre, index) =>
                            <Link to={`/tag/${genre.id}`} className="flex flex-col gap-y-3" key={index}>
                                <div className="mx-4">
                                    <div>{genre.tag.replace(/\b\w/g, char => char.toUpperCase())} <span className="text-muted-foreground font-extralight">({genre.count.toLocaleString()} books)</span>
                                    </div>
                                </div>
                                <Separator/>
                            </Link>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="moods" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {loading ? (
                            <div className="text-center text-muted-foreground py-10">Loading...</div>
                        ) : (tags.map((mood, index) =>
                            <Link to={`/tag/${mood.id}`} className="flex flex-col gap-y-3" key={index}>
                                <div className="mx-4">
                                    <div>{mood.tag.replace(/\b\w/g, char => char.toUpperCase())}
                                        <span className="text-muted-foreground font-extralight">({mood.count.toLocaleString()} books) </span>
                                    </div>
                                </div>
                                <Separator/>
                            </Link>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="tags" className="relative w-full overflow-auto">
                    <div className="grid gap-y-8 py-10 mx-auto w-3/4">
                        {loading ? (
                            <div className="text-center text-muted-foreground py-10">Loading...</div>
                        ) : (tags.map((tag, index) =>
                            <Link to={`/tag/${tag.id}`} className="flex flex-col gap-y-3" key={index}>
                                <div className="mx-4">
                                    <div>{tag.tag.replace(/\b\w/g, char => char.toUpperCase())} <span className="text-muted-foreground font-extralight">({tag.count.toLocaleString()} books)</span>
                                    </div>
                                </div>
                                <Separator/>
                            </Link>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default BrowseTagsPage;
