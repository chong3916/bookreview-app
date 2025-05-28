import type {BookDocument} from "@/components/types/BookModel.ts";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Link} from "react-router";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";

interface RecommendationCarousel {
    books: BookDocument[],
    side: "top" | "right" | "bottom" | "left" | undefined
}

const RecommendationCarousel: React.FC<RecommendationCarousel> = ({ books, side }) => {
    return (
        <Carousel className="w-full my-2" slideNumScroll={5}>
            <CarouselContent className="-ml-1">
                {books.map((book, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/4 lg:basis-1/5">
                        <Link to={`/book/${book.id}`}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="p-1">
                                            {book.image?.url ? <img
                                                className="w-full h-auto object-contain rounded-sm border-2 border-transparent hover:border-accent"
                                                src={book.image.url}
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
            <CarouselPrevious className="cursor-pointer hover:text-primary"/>
            <CarouselNext className="cursor-pointer hover:text-primary"/>
        </Carousel>
    )
}

export default RecommendationCarousel;
