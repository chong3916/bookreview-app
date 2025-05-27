import {Link} from "react-router";
import {Card} from "@/components/ui/card.tsx";
import type {AuthorDocument} from "@/components/types/AuthorModel.ts";

const AuthorCard: React.FC<{author: AuthorDocument}> = ({ author }) => {
    return (
        <Card className="w-full overflow-hidden p-0 min-h-[12rem] rounded-sm bg-card border-card-border">
            <div className="flex gap-6 items-stretch">
                {author.image && author.image.url? (
                    <div className="w-36 aspect-[2/3] bg-card rounded-sm flex-shrink-0 flex-grow-0">
                        <Link to={`/author/${author.id}`} className="block w-full h-auto">
                            <img
                                src={author.image.url}
                                alt={author.name}
                                className="w-full h-full object-cover rounded-sm"
                            />
                        </Link>
                    </div>
                ) : (
                    <Link to={`/author/${author.id}`} className="w-36 aspect-[2/3] rounded-sm flex-shrink-0 flex-grow-0">
                        <div className="w-36 aspect-[2/3] bg-slate-200 object-cover rounded-sm" />
                    </Link>
                )}
                <div className="flex flex-col justify-center pr-6 py-4 space-y-3 flex-grow min-w-0">
                    <Link
                        to={`/author/${author.id}`}
                        className="text-xl font-semibold hover:text-muted-foreground tracking-wide"
                    >{author.name}</Link>
                    <div className="truncate overflow-hidden whitespace-nowrap text-sm text-muted-foreground">
                        {author.books.slice(0, 3).map((book, index) => (
                            <span key={index}>
                                <Link
                                    to={`/search?q=${author.books[index].trim()
                                        .replace(/[^a-zA-Z0-9 ]/g, '') // remove special chars except spaces
                                        .replace(/\s+/g, '+')}`}
                                    className="text-secondary-foreground hover:text-muted-foreground font-light"
                                >{book}</Link>
                                {index < Math.min(author.books.length - 1, 2) && ', '}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default AuthorCard;
