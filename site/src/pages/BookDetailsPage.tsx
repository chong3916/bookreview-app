import {Link, useParams} from "react-router";
import React, {useEffect, useState} from "react";
import type BookDetailModel from "@/components/types/BookDetailModel.ts";
import {bookService} from "@/api/book.ts";
import {Separator} from "@/components/ui/separator"
import {testBookDetails} from "@/bookDetailsFixtures.ts";
import type {BookDocument, Contribution} from "@/components/types/BookModel.ts";
import {Button} from "@/components/ui/button.tsx";
import StarRating from "@/components/StarRating.tsx";
import BookDetailsTabs from "@/components/BookDetailsTabs.tsx";
import BookDetailsSeries from "@/components/BookDetailsSeries.tsx";
import RecommendationCarousel from "@/components/RecommendationCarousel.tsx";
import {testRecommendations} from "@/recommendationFixtures.ts";
import AddBookButtonDetails from "@/components/AddBookButtonDetails.tsx";

const BookDetailsPage: React.FC<{}> = () => {
    const {bookId} = useParams();
    const [bookDetails, setBookDetails] = useState<BookDetailModel | null>(null)
    const [recommendations, setRecommendations] = useState<BookDocument[]>([])
    const [loading, setLoading] = useState<boolean>(false);

    const authors: string[] = bookDetails?.contributions?.map((contributor: Contribution) => {
        const name = contributor.author.name;
        const contribution = contributor.contribution;
        return contribution ? `${name} (${contribution})` : name;
    }) ?? [];

    useEffect(() => {
        console.log(bookId)
        if (!bookId) return;
        getDetails(bookId).then((response) => getRecommendations(response.title))
    }, [bookId])

    const getDetails = async (id: string) => {
        // try {
        //     const response = await bookService.getBook(id);
        //     console.log(response)
        //     setBookDetails(response);
        //     return response
        // } catch (err) {
        //     console.error("Error fetching book details:", err);
        // }

        setBookDetails(testBookDetails)
        return testBookDetails
    }

    const getRecommendations = async (title: string) => {
        if(!title) return
        try {
            setLoading(true)
            // const response = await bookService.getRecommendations(title);
            // console.log(response)
            // setRecommendations(response);
            setRecommendations(testRecommendations)
        } catch (err) {
            console.error("Error fetching book recommendations:", err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="grid gap-y-8 py-10 mx-auto w-5/6">
            {bookDetails ?
                (
                    <div className="flex items-start md:flex-row flex-col">
                        {/* Left side of page */}
                        <div className="fixed top-24 left-20 w-1/4 max-w-xs z-40">
                            {bookDetails.image_url ? <img
                                src={bookDetails.image_url}
                                alt={bookDetails.title}
                                className="w-full h-auto object-contain rounded"
                            /> : <div className="w-36 aspect-[2/3] bg-gray-200 rounded" />}
                            <div className="w-full my-5"><AddBookButtonDetails bookId={Number(bookId)}/></div>
                        </div>
                        {/* Right side of page */}
                        <div className="flex flex-col pb-3 w-full ml-[30%] mt-16">
                            <div className="text-xl md:text-2xl tracking-wide">{bookDetails.title}</div> {/* Title */}

                            <div className="flex flex-row mb-2"> {/* Authors */}
                                {authors?.map((author, i) => (
                                    <Link to={`/author/${bookDetails.contributions[i].author.id}`} className="text-base md:text-lg font-light pr-2 hover:text-foreground/60" key={i}>
                                        {author}
                                        {i < authors.length - 1 && ','}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-col"> {/* Page and publish date */}
                                <div className="flex flex-row h-3 items-center space-x-2 text-sm">
                                    <div className="font-thin">{bookDetails.pages} pages</div>
                                    <Separator orientation="vertical" className="bg-slate-600"/>
                                    <div className="font-thin">First published {bookDetails.release_year}</div>
                                </div>
                            </div>

                            <div className="flex flex-row my-3 items-center tracking-wide text-sm h-3"> {/* Reviews/Ratings */}
                                <div className="mr-2"><StarRating value={Math.trunc(bookDetails.rating * 100) / 100} readOnly={true} size="md" fillColor="text-star-color fill-star-color"/></div>
                                <div className="mr-2">{Math.trunc(bookDetails.rating * 100) / 100}</div>
                                <Separator orientation="vertical"/>
                                <div className="m-2">{bookDetails.reviews_count}</div>
                                <div className="text-slate-500">RATINGS</div>
                            </div>

                            {/* Tabs */}
                            <BookDetailsTabs bookDetails={bookDetails}/>

                            {/* Series */}
                            {bookDetails.featured_book_series?.series ?
                                <BookDetailsSeries series={bookDetails.featured_book_series.series} position={bookDetails.featured_book_series.position}/> : null}

                            {/* Recommendations */}
                            <div>RECOMMENDATIONS</div>
                            {loading ? (
                                <div className="text-center text-muted-foreground py-10">Loading...</div>
                            ) : (recommendations ? <RecommendationCarousel books={recommendations} side="top"/> : null)}
                        </div>
                    </div>)
                : null}
        </div>
    );
}

export default BookDetailsPage;
