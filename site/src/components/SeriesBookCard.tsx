import type {SeriesBook} from "@/components/types/BookModel.ts";
import {Link} from "react-router";
import StarRating from "@/components/StarRating.tsx";

const SeriesBookCard: React.FC<{book: SeriesBook}> = ({ book }) => {
    const authors: string[] = book.authors?.map((author) => {
        const name = author.name;
        const contribution = author.contribution;
        return contribution ? `${name} (${contribution})` : name;
    }) ?? [];

    let formattedDate = book.release_year?.toString();
    let publishStr = "published"
    if (book.release_year) {
        const date = new Date(book.release_year, 0, 1);
        const today = new Date();
        if (date > today) publishStr = "publishing"
    }

    return (
        <div className="w-full overflow-hidden p-0 min-h-[6rem] bg-card border-card-border ">
            <div className="flex gap-6 items-stretch">
                {book.image_url ? (
                    <div className="w-28 aspect-[2/3] bg-card shrink-0">
                        <Link to={`/book/${book.book_id}`} className="block w-full h-auto">
                            <img
                                src={book.image_url}
                                alt={book.title}
                                className="w-full h-full object-cover border-2 border-transparent hover:border-accent"
                            />
                        </Link>
                    </div>
                ) : (
                    <Link to={`/book/${book.book_id}`} className="w-20 aspect-[2/3] flex-shrink-0 flex-grow-0">
                        <div className="w-20 aspect-[2/3] bg-slate-200 object-cover " />
                    </Link>
                )}

                <div className="flex flex-col justify-center pr-6 py-4 space-y-3">
                    <Link
                        to={`/book/${book.book_id}`}
                        className="text-base font-semibold hover:text-muted-foreground tracking-wide"
                    >{book.title}</Link>

                    <div>
                        {authors.map((author, index) => (
                            <span key={author} className="inline-flex items-center pr-1">
                                <Link
                                    to={`/author/${book.authors?.[index].id}`}
                                    className="text-muted-foreground text-sm font-light hover:text-card-muted-foreground"
                                >{author}</Link>
                                <div className="text-muted-foreground">{index < authors.length - 1 && ', '}</div>
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-1 text-xs text-muted-foreground font-thin">
                        {book.rating ? <StarRating value={Math.trunc(book.rating * 100) / 100} readOnly={true} size="sm" fillColor="text-star-color fill-star-color"/>
                            : <StarRating value={0} readOnly={true} size="sm" fillColor="text-star-color fill-star-color"/>}
                        {book.rating ? <div>{Math.trunc(book.rating * 100) / 100} avg rating - </div> : null}
                        <div>{book.ratings_count} ratings</div>
                        {formattedDate ? <div> - {publishStr} {formattedDate}</div> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeriesBookCard;
