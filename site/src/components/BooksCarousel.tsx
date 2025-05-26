import type {SeriesBook} from "@/components/types/BookModel.ts";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Link} from "react-router";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";

interface BooksCarouselProps {
    books: SeriesBook[],
    side: "top" | "right" | "bottom" | "left" | undefined
}

const BooksCarousel: React.FC<BooksCarouselProps> = ({ books, side }) => {
    return (
        <Carousel className="w-full my-2" slideNumScroll={5}>
            <CarouselContent className="-ml-1">
                {books.map((book, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/4 lg:basis-1/5">
                        <Link to={`/book/${book.book_id}`}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="p-1">
                                            {book.image_url ? <img
                                                className="w-full h-auto object-contain rounded-sm"
                                                src={book.image_url}
                                                alt={book.title}
                                            /> : <div className="w-full aspect-[2/3] bg-gray-200 rounded-sm"/>}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="bg-indigo-600 text-white"
                                        sideOffset={8}
                                        side={side}
                                    >
                                        <div>{book.title}</div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="cursor-pointer"/>
            <CarouselNext className="cursor-pointer"/>
        </Carousel>
    )
}

export default BooksCarousel;
