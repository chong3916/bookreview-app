import {Link, useParams} from "react-router";
import {useEffect, useState} from "react";
import {authorService} from "@/api/author.ts";
import type AuthorDetailModel from "@/components/types/AuthorDetailModel.ts";
import {testAuthorDetails} from "@/authorDetailsFixtures.ts";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import AuthorBookCard from "@/components/AuthorBookCard.tsx";
import StarRating from "@/components/StarRating.tsx";

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
                        <div className="fixed top-24 left-20 w-1/3 max-w-xs z-40">
                            {authorDetails.image_url ? <img
                                src={authorDetails.image_url}
                                alt={authorDetails.name ? authorDetails.name : authorDetails.id.toString()}
                                className="w-full rounded shadow-md aspect-[2/3] object-cover"
                            /> : <div className="w-36 aspect-[2/3] bg-gray-200 rounded" />}
                            {/*<Button className="w-full my-3 bg-primary text-primary-foreground">WANT TO READ</Button>*/}
                        </div>


                        {/* Right side of page */}
                        <div className="flex flex-col pb-3 w-full ml-[30%] mt-16 gap-y-10">
                            <div className="flex flex-col gap-y-2">
                                <div className="text-xl md:text-2xl tracking-wide">{authorDetails.name}</div> {/* Title */}
                                <Separator className="bg-primary"/>

                                {/* Author info */}
                                <div className="flex flex-col mx-4 mt-2 gap-y-4">
                                    {/* Author bio */}
                                    <div className="leading-relaxed text-base max-w-prose">{authorDetails.bio?.replace(/https?:\/\/[^\s"]+/g, '').trim()}</div>

                                    <div className="grid grid-cols-10 gap-y-1.5 text-sm items-start tracking-wide">
                                        {/*{authorDetails.born_date || authorDetails.born_year ? <div className="col-span-1 text-tabs-muted-foreground">Born</div> : null}*/}
                                        <div className="col-span-1 text-tabs-muted-foreground">Links: </div>
                                        <div className="col-span-9 text-tabs-foreground grid grid-cols-1">{urls?.map((url) => <Link to={url} target="_blank">{url}</Link>)}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Author books */}
                            <div className="flex flex-col gap-y-2">
                                <div className="mt-10 text-base md:text-base tracking-wide">BOOKS</div>
                                <Separator className="bg-primary"/>
                                <div className="mx-2">
                                    <div className="text-sm text-tabs-foreground font-extralight flex flex-row gap-x-2">
                                        {authorDetails.avg_rating ? <StarRating value={Math.trunc(authorDetails.avg_rating * 100) / 100} readOnly={true} size="sm" fillColor="text-star-color fill-star-color"/>
                                            : <StarRating value={0} readOnly={true} size="sm" fillColor="text-star-color fill-star-color"/>}
                                        {authorDetails.avg_rating ? `Total avg ratings: ${Math.trunc(authorDetails.avg_rating * 100) / 100} - `: null}{authorDetails.ratings_count} ratings - {authorDetails.reviews_count} reviews - {authorDetails.books_count} works
                                    </div>
                                </div>
                                <div className="flex flex-col mx-4 mt-2 gap-y-3">
                                    {authorDetails.books.map((book) =>
                                        <div className="flex flex-col gap-y-3"><AuthorBookCard book={book}/><Separator/></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>)
                : null}
        </div>
    )
}

export default AuthorDetailsPage;
