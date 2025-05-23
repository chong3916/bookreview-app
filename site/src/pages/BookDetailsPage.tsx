import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import type BookDetailModel from "@/components/types/BookDetailModel.ts";
import {bookService} from "@/api/book.ts";
import {Separator} from "@/components/ui/separator"
import {testBookDetails} from "@/fixtures.ts";
import type {Contribution} from "@/components/types/BookModel.ts";
import {Button} from "@/components/ui/button.tsx";
import StarRating from "@/components/StarRating.tsx";
import BookDetailsTabs from "@/components/BookDetailsTabs.tsx";
import BookDetailsSeries from "@/components/BookDetailsSeries.tsx";

const BookDetailsPage: React.FC<{}> = () => {
    const {bookId} = useParams();
    const [bookDetails, setBookDetails] = useState<BookDetailModel | null>(null)
    const hasRefreshed = useRef(false);

    const authors: string[] = bookDetails?.contributions?.map((contributor: Contribution) => {
        const name = contributor.author.name;
        const contribution = contributor.contribution;
        return contribution ? `${name} (${contribution})` : name;
    }) ?? [];

    useEffect(() => {
        console.log(bookId)
        if (!bookId || hasRefreshed.current) return;

        hasRefreshed.current = true;
        getDetails(bookId);
    }, [bookId])

    const getDetails = async (id: string) => {
        // try {
        //     const response = await bookService.getBook(id);
        //     console.log(response)
        //     setBookDetails(response);
        // } catch (err) {
        //     console.error("Error fetching book details:", err);
        // }
        const response = testBookDetails
        console.log(response)
        setBookDetails(response)
    }

    return (
        <div className="grid gap-y-8 py-10 mx-auto w-5/6">
            {bookDetails ?
                (
                    <div className="flex items-start md:flex-row flex-col">
                        {/* Left side of page */}
                        <div className="w-full md:w-1/4 flex-shrink-0 mb-6 md:mb-0">
                            {bookDetails.image ? <img
                                src={bookDetails.image.url}
                                alt={bookDetails.title}
                                className="w-full h-auto object-contain rounded"
                            /> : <div className="w-36 aspect-[2/3] bg-gray-200 rounded" />}
                            <Button className="w-full my-3 bg-indigo-500 text-white">WANT TO READ</Button>
                        </div>
                        {/* Right side of page */}
                        <div className="flex flex-col md:mx-10 pb-3 w-full">
                            <div className="text-xl md:text-2xl tracking-wide">{bookDetails.title}</div> {/* Title */}

                            <div className="flex flex-row mb-2"> {/* Authors */}
                                {authors?.map((author, i) => (
                                    <div className="text-base md:text-lg font-light pr-2" key={i}>
                                        {author}
                                        {i < authors.length - 1 && ','}
                                    </div>
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
                                <div className="mr-2"><StarRating value={Math.trunc(bookDetails.rating * 100) / 100} readOnly={true} size="md"/></div>
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
                        </div>
                    </div>)
                : null}
        </div>
    );
}

export default BookDetailsPage;
