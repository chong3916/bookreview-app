import {Card} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge"
import {Link} from "react-router";
import type {BookDocument} from "@/components/types/BookModel.ts";
import {useEffect} from "react";
import StarRating from "@/components/StarRating.tsx";
import AddBookButton from "@/components/AddBookButton.tsx";

const BookCard: React.FC<{ book: BookDocument }> = ({ book }) => {
    const authors: string[] = book.contributions?.map((contributor) => {
        const name = contributor.author.name;
        const contribution = contributor.contribution;
        return contribution ? `${name} (${contribution})` : name;
    }) ?? [];

    let formattedDate = null;
    let publishStr = "published"
    if (book.release_date) {
        const date = new Date(book.release_date);
        const today = new Date();
        if (date > today) publishStr = "publishing"
        formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    useEffect(() => {
        console.log(book)
    }, [])

    return (
        <Card className="w-full overflow-hidden p-0 min-h-[12rem] rounded-sm bg-card border-card-border">
            <div className="flex gap-6 items-stretch">
                {book.image && book.image.url? (
                    <div className="w-36 aspect-[2/3] bg-card shrink-0 rounded-sm">
                        <Link to={`/book/${book.id}`} className="block w-full h-auto">
                            <img
                                src={book.image.url}
                                alt={book.title}
                                className="w-full h-full object-cover rounded-sm"
                            />
                        </Link>
                    </div>
                ) : (
                    <Link to={`/book/${book.id}`} className="w-36 aspect-[2/3] rounded-sm flex-shrink-0 flex-grow-0">
                        <div className="w-36 aspect-[2/3] bg-slate-200 object-cover rounded-sm" />
                    </Link>
                )}
                <div className="flex flex-col justify-center pr-6 py-4 space-y-3">
                    <div className="grid grid-cols-10 items-center">
                        <div className="col-span-8 flex flex-col justify-center pr-6 py-4 space-y-3">
                            <Link
                                to={`/book/${book.id}`}
                                className="text-xl font-semibold hover:text-muted-foreground tracking-wide"
                            >{book.title}</Link>
                            <div>
                                {authors.slice(0, 5).map((author, index) => (
                                    <span key={author} className="text-secondary-foreground">
                                        <Link
                                            to={`/author/${(book.contributions?.[index]?.author?.id ?? "")}`}
                                            className="hover:text-muted-foreground/70 font-light"
                                        >{author}</Link>
                                        {index < authors.length - 1 && ', '}
                                    </span>
                                ))}
                                {authors.length > 5 ? <span className="text-secondary-foreground tracking-widest">...</span> : null}
                            </div>
                            <div className="flex gap-1 text-xs text-muted-foreground font-thin">
                                {book.rating ? <StarRating value={Math.trunc(book.rating * 100) / 100} readOnly={true} size="sm" fillColor="text-star-color fill-star-color"/>
                                    : <StarRating value={0} readOnly={true} size="sm" fillColor="text-star-color fill-star-color"/>}
                                {book.rating ? <div>{Math.trunc(book.rating * 100) / 100} avg rating - </div> : null}
                                <div>{book.ratings_count} ratings</div>
                                {formattedDate ? (<div> - {publishStr} {formattedDate}</div>) : (book.release_year ? <div> - published {book.release_year}</div> : null)}
                            </div>
                        </div>
                        <div className="justify-self-center"><AddBookButton bookId={book.id}/></div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {book.genres?.slice(0, 5).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-badge-foreground hover:text-badge-hover cursor-pointer" style={{ borderRadius: '3px' }}>
                                {genre}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default BookCard;
