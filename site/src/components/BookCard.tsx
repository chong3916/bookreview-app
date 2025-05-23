import {Card} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge"
import {Link} from "react-router";
import type {BookDocument} from "@/components/types/BookModel.ts";
import {useEffect} from "react";

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
        <Card className="w-full overflow-hidden p-0 bg-slate-700 min-h-[12rem]" style={{ borderRadius: '2px' }}>
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
                <div className="flex flex-col justify-center pr-6 py-4">
                    <Link
                        to={`/books/${book.id}`}
                        className="text-current text-xl font-semibold hover:text-muted-foreground"
                    >{book.title}</Link>
                    <div>
                        {authors.map((author, index) => (
                            <span key={author}>
                                <Link
                                    to={`/search?author=${encodeURIComponent(author)}`}
                                    className="text-current hover:text-muted-foreground"
                                >{author}</Link>
                                {index < authors.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-1 p-2">

                    </div>
                    <div className="flex flex-wrap gap-1 p-2">
                        {book.genres?.slice(0, 10).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-green-300" style={{ borderRadius: '3px' }}>
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
