import {Card} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge"
import {Link} from "react-router";
import type {BookDocument} from "@/components/types/BookModel.ts";
import {useEffect} from "react";
import StarRating from "@/components/StarRating.tsx";

const BookCard: React.FC<{ book: BookDocument }> = ({book}) => {
    const authors: string[] = book.contributions?.map((contributor) => {
        const name = contributor.author.name;
        const contribution = contributor.contribution;
        return contribution ? `${name} (${contribution})` : name;
    }) ?? [];

    useEffect(() => {
        console.log(book)
    }, [])

    return (
        <Card className="w-full overflow-hidden p-0 bg-slate-900 min-h-[12rem] rounded-sm">
            <div className="flex gap-6 items-stretch">
                {book.image ? (
                    <img
                        src={book.image.url}
                        alt={book.title}
                        className="object-cover w-36"
                    />
                ) : (
                    <div className="w-36 aspect-[2/3] bg-gray-200"/>
                )}
                <div className="flex flex-col justify-center pr-6 py-4 space-y-3">
                    <Link
                        to={`/books/${book.id}`}
                        className="text-xl font-semibold hover:text-muted-foreground tracking-wide text-slate-200"
                    >{book.title}</Link>
                    <div>
                        {authors.map((author, index) => (
                            <span key={author}>
                                <Link
                                    to={`/search?author=${encodeURIComponent(author)}`}
                                    className="text-slate-300 hover:text-muted-foreground font-light"
                                >{author}</Link>
                                {index < authors.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-1 text-xs text-slate-400 font-thin">
                        <StarRating value={Math.trunc(book.rating * 100) / 100} readOnly={true} size="sm" fillColor="text-indigo-400 fill-indigo-400"/>
                        <div>{Math.trunc(book.rating * 100) / 100} avg rating - </div>
                        <div>{book.ratings_count} ratings - </div>
                        <div>published {book.release_year}</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {book.genres?.slice(0, 10).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-indigo-500" style={{ borderRadius: '3px' }}>
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
