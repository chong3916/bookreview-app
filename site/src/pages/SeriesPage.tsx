import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {testSeries} from "@/seriesFixtures.ts";
import type {Series} from "@/components/types/BookModel.ts";
import {Separator} from "@/components/ui/separator.tsx";
import SeriesBookCard from "@/components/SeriesBookCard.tsx";

const SeriesPage: React.FC<{}> = () => {
    const {seriesId} = useParams();
    const [series, setSeries] = useState<Series | null>(null)

    useEffect(() => {
        console.log(seriesId)
        if (!seriesId) return;
        getSeries(seriesId);
    }, [seriesId])

    const getSeries = async (id: string) => {
        // try {
        //     const response = await bookService.getSeries(id);
        //     console.log(response)
        //     setSeries(response);
        // } catch (err) {
        //     console.error("Error fetching book details:", err);
        // }

        setSeries(testSeries)
    }

    return (
        <div className="grid gap-y-8 py-10 mx-auto w-3/4 mt-20">
            {series ?
                <div className="flex flex-col gap-y-2">
                    <div className="text-2xl tracking-wide">{series.name} Series</div>
                    <div className="text-sm tracking-wide text-muted-foreground font-light">{series.primary_books_count} primary works - {series.books_count} total works</div>
                    <Separator />
                    <div className="flex flex-col mx-4 mt-2 gap-y-3">
                        {series.book_series?.map((book, index) =>
                            <div className="flex flex-col gap-y-3" key={index}>
                                <div className="text-sm trackwing-wide text-tabs-foreground ">BOOK {book.position}</div>
                                <SeriesBookCard book={book}/>
                                <Separator/>
                            </div>
                        )}
                    </div>
                </div>
            : null}
        </div>
    )
}

export default SeriesPage;
