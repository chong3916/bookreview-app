import type { Series } from "@/components/types/BookModel.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {ScrollArea} from "@radix-ui/react-scroll-area";
import {ScrollBar} from "@/components/ui/scroll-area.tsx";
import {Link} from "react-router";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"

interface BookDetailsSeriesProps {
    series: Series,
    position: number
}

const BookDetailsSeries: React.FC<BookDetailsSeriesProps> = ({ series, position }) => {
    return (<div className="w-full">
        <div className="text-lg md:text-xl tracking-wide">Series</div>

        <div className="flex flex-row items-center gap-2 mb-2">
            <div className="text-slate-500">Featured Series</div>
            <Badge variant="default" className="text-xs h-5 bg-yellow-300 text-yellow-950 !border-none">
                {series.primary_books_count} primary books
            </Badge>
            <Badge variant="default" className="text-xs h-5 bg-slate-700 text-slate-400 !border-none">
                {series.books_count} released books
            </Badge>
        </div>

        <div className="text-lg italic font-light tracking-wide text-slate-300">
            <Link to={`/series/${series.id}`}>{series.name} #{position}</Link>
        </div>

        <div className="w-full overflow-x-auto">
            <ScrollArea className="w-96 whitespace-nowrap">
                <div className="flex w-max space-x-4 p-4">
                    {series.series_books.map((book) => (
                        <Link to={`/books/${book.book_id}`}>
                            <div className="overflow-hidden w-32 shrink-0" key={book.book_id}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {book.image_url ? <img
                                                className="w-full h-auto object-contain rounded-sm"
                                                src={book.image_url}
                                                alt={book.title}
                                            /> : <div className="w-32 aspect-[2/3] bg-gray-200 rounded-sm"/>}
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="bg-indigo-600 text-white"
                                            sideOffset={8}
                                        >
                                            <div>{book.title}</div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    </div>)
}

export default BookDetailsSeries;
