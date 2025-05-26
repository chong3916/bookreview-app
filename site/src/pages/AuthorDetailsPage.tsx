import {Link, useParams} from "react-router";
import {useEffect, useState} from "react";
import {testBookDetails} from "@/bookDetailsFixtures.ts";
import {authorService} from "@/api/author.ts";
import type AuthorDetailModel from "@/components/types/AuthorDetailModel.ts";
import {testAuthorDetails} from "@/authorDetailsFixtures.ts";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import StarRating from "@/components/StarRating.tsx";
import BookDetailsTabs from "@/components/BookDetailsTabs.tsx";
import BookDetailsSeries from "@/components/BookDetailsSeries.tsx";
import AuthorBookCard from "@/components/AuthorBookCard.tsx";

const AuthorDetailsPage: React.FC<{}> = () => {
    const {authorId} = useParams();
    const [authorDetails, setAuthorDetails] = useState<AuthorDetailModel | null>(null)

    // let bornDate = authorDetails?.born_year?.toString();
    // let deathDate = authorDetails?.death_year?.toString();
    // if (authorDetails?.born_date) {
    //     const date = new Date(authorDetails.born_date);
    //     bornDate = date.toLocaleDateString("en-US", {
    //         year: "numeric",
    //         month: "long",
    //         day: "numeric",
    //     });
    // }
    // if (authorDetails?.death_date) {
    //     const date = new Date(authorDetails.death_date);
    //     deathDate = date.toLocaleDateString("en-US", {
    //         year: "numeric",
    //         month: "long",
    //         day: "numeric",
    //     });
    // }

    const urls = authorDetails?.bio?.match(/https?:\/\/[^\s"]+/g);

    useEffect(() => {
        console.log(authorId)
        if (!authorId) return;
        getDetails(authorId);
    }, [authorId])

    const getDetails = async (id: string) => {
        // try {
        //     const response = await authorService.getDetails(id);
        //     console.log(response)
        //     setAuthorDetails(response);
        // } catch (err) {
        //     console.error("Error fetching book details:", err);
        // }

        setAuthorDetails(testAuthorDetails)
    }

    return (
        <div className="grid gap-y-8 py-10 mx-auto w-5/6">
            {authorDetails ?
                (
                    <div className="flex items-start md:flex-row flex-col">
                        {/* Left side of page */}
                        <div className="fixed top-24 left-20 w-1/4 max-w-xs z-40">
                            {authorDetails.image_url ? <img
                                src={authorDetails.image_url}
                                alt={authorDetails.name ? authorDetails.name : authorDetails.id.toString()}
                                className="w-full h-auto object-contain rounded"
                            /> : <div className="w-36 aspect-[2/3] bg-gray-200 rounded" />}
                            <Button className="w-full my-3 bg-primary text-primary-foreground">WANT TO READ</Button>
                        </div>


                        {/* Right side of page */}
                        <div className="flex flex-col pb-3 w-full ml-[30%] mt-16 gap-y-10">
                            <div className="flex flex-col gap-y-2">
                                <div className="text-xl md:text-2xl tracking-wide">{authorDetails.name}</div> {/* Title */}
                                <Separator/>

                                {/* Author info */}
                                <div className="mx-4 mt-2">
                                    <div className="grid grid-cols-10 gap-y-1.5 text-sm items-start">
                                        {/*{authorDetails.born_date || authorDetails.born_year ? <div className="col-span-1 text-tabs-muted-foreground">Born</div> : null}*/}
                                        <div className="col-span-1 text-tabs-muted-foreground">Links: </div>
                                        <div className="col-span-9 text-tabs-foreground grid grid-cols-1">{urls?.map((url) => <Link to={url} target="_blank">{url}</Link>)}</div>
                                    </div>

                                    {/* Author bio */}
                                    <div className="text-base font-light tracking-wide mt-3">{authorDetails.bio?.replace(/https?:\/\/[^\s"]+/g, '').trim()}</div>
                                </div>
                            </div>
                            {/* Author books */}
                            <div className="flex flex-col gap-y-2">
                                <div className="mt-10 text-base md:text-base tracking-wide">{authorDetails.name?.toUpperCase()} BOOKS</div>
                                <Separator/>
                                <div className="mx-2">
                                    <div className="text-xs text-tabs-foreground font-light">
                                        {authorDetails.avg_rating ? `Avg rating: ${Math.trunc(authorDetails.avg_rating * 100) / 100} - `: null}{authorDetails.ratings_count} ratings - {authorDetails.reviews_count} reviews - {authorDetails.books_count} works
                                    </div>
                                </div>
                                <div className="flex flex-col mx-4 mt-2 gap-y-3">
                                    {authorDetails.books.map((book) =>
                                        <div className="flex flex-col gap-y-3"><AuthorBookCard book={book}/><Separator/></div>
                                    )}
                                </div>
                            </div>
                            {/*<div className="flex flex-col"> /!* Page and publish date *!/*/}
                            {/*    <div className="flex flex-row h-3 items-center space-x-2 text-sm">*/}
                            {/*        {<div className="font-thin">{authorDetails.avg_rating} avg rating</div>}*/}
                            {/*        <Separator orientation="vertical" className="bg-slate-600"/>*/}
                            {/*        <div className="font-thin">First published {bookDetails.release_year}</div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<div className="flex flex-row my-3 items-center tracking-wide text-sm h-3"> /!* Reviews/Ratings *!/*/}
                            {/*    <div className="mr-2"><StarRating value={Math.trunc(bookDetails.rating * 100) / 100} readOnly={true} size="md" fillColor="text-star-color fill-star-color"/></div>*/}
                            {/*    <div className="mr-2">{Math.trunc(bookDetails.rating * 100) / 100}</div>*/}
                            {/*    <Separator orientation="vertical"/>*/}
                            {/*    <div className="m-2">{bookDetails.reviews_count}</div>*/}
                            {/*    <div className="text-slate-500">RATINGS</div>*/}
                            {/*</div>*/}

                            {/* Tabs */}
                            {/*<BookDetailsTabs bookDetails={bookDetails}/>*/}

                            {/* Series */}
                            {/*{bookDetails.featured_book_series?.series ?*/}
                            {/*    <BookDetailsSeries series={bookDetails.featured_book_series.series} position={bookDetails.featured_book_series.position}/> : null}*/}
                        </div>
                    </div>)
                : null}
        </div>
    )
}

export default AuthorDetailsPage;
