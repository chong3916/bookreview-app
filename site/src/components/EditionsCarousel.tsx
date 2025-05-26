import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Link} from "react-router";
import type {BasicEditionBook} from "@/components/types/BookDetailModel.ts";

interface EditionsCarouselProps {
    editions: BasicEditionBook[],
    title: string
}

const EditionsCarousel: React.FC<EditionsCarouselProps> = ({ editions, title }) => {
    return (
        <Carousel className="w-full my-2" slideNumScroll={5}>
            <CarouselContent className="-ml-1">
                {editions.map((edition, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/4 lg:basis-1/5">
                        <Link to={`/book/${edition.id}`}>
                            <div className="p-1 rounded-sm">
                                {edition.image_url ? <img
                                    className="w-full h-auto max-h-55 object-contain rounded-sm"
                                    src={edition.image_url}
                                    alt={title}
                                /> : <div className="w-full aspect-[2/3] bg-gray-200 rounded-sm"/>}
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="cursor-pointer"/>
            <CarouselNext className="cursor-pointer"/>
        </Carousel>
    )
}

export default EditionsCarousel;
