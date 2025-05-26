import {Link} from "react-router";
import {Card} from "@/components/ui/card.tsx";
import type {AuthorDocument} from "@/components/types/AuthorModel.ts";

const AuthorCard: React.FC<{author: AuthorDocument}> = ({ author }) => {
    return (
        <Card className="w-full overflow-hidden p-0 min-h-[12rem] rounded-sm bg-card border-card-border">
            <div className="flex gap-6 items-stretch">
                {author.image && author.image.url? (
                    <img
                        src={author.image.url}
                        alt={author.name}
                        className="object-cover w-36 h-auto"
                    />
                ) : (
                    <div className="w-36 aspect-[2/3] bg-gray-200"/>
                )}
                <div className="flex flex-col justify-center pr-6 py-4 space-y-3">
                    <Link
                        to={`/author/${author.id}`}
                        className="text-xl font-semibold hover:text-muted-foreground tracking-wide"
                    >{author.name}</Link>
                    <div>
                        {author.books.slice(0, 3).map((book, index) => (
                            <span key={index}>
                                <Link
                                    to={`/search?q=${author.books[index].trim()
                                        .replace(/[^a-zA-Z0-9 ]/g, '') // remove special chars except spaces
                                        .replace(/\s+/g, '+')}`}
                                    className="text-secondary-foreground hover:text-muted-foreground font-light"
                                >{book}</Link>
                                {index < author.books.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                    {/*<div className="flex gap-1 text-xs text-muted-foreground font-thin">*/}
                    {/*    {book.rating ? <StarRating value={Math.trunc(book.rating * 100) / 100} readOnly={true} size="sm" fillColor="text-star-color fill-star-color"/>*/}
                    {/*        : <StarRating value={0} readOnly={true} size="sm" fillColor="text-star-color fill-star-color"/>}*/}
                    {/*    {book.rating ? <div>{Math.trunc(book.rating * 100) / 100} avg rating - </div> : null}*/}
                    {/*    <div>{book.ratings_count} ratings</div>*/}
                    {/*    {formattedDate ? (<div> - {publishStr} {formattedDate}</div>) : (book.release_year ? <div> - published {book.release_year}</div> : null)}*/}
                    {/*</div>*/}
                    {/*<div className="flex flex-wrap gap-1">*/}
                    {/*    {book.genres?.slice(0, 10).map((genre) => (*/}
                    {/*        <Badge key={genre} variant="outline" className="text-badge-foreground hover:text-badge-hover cursor-pointer" style={{ borderRadius: '3px' }}>*/}
                    {/*            {genre}*/}
                    {/*        </Badge>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
            </div>
        </Card>
    )
}

export default AuthorCard;
