import type { Series } from "@/components/types/BookModel.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {Link} from "react-router";
import BooksCarousel from "@/components/BooksCarousel.tsx";

interface BookDetailsSeriesProps {
    series: Series,
    position?: number
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

        {position ? <div className="text-lg italic font-light tracking-wide text-slate-300">
            <Link to={`/series/${series.id}`}>{series.name} #{position}</Link>
        </div> : null}

        <BooksCarousel books={series.series_books} side={"top"}/>
    </div>)
}

export default BookDetailsSeries;
