import {Link} from "react-router";
import {Card} from "@/components/ui/card.tsx";
import StarRating from "@/components/StarRating.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import type {UpcomingModel} from "@/components/types/UpcomingModel.ts";


const UpcomingCard: React.FC<{ book: UpcomingModel }> = ({ book }  ) => {
    const authors: string[] = book.authors?.map((contributor) => {
        const name = contributor.name;
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

    return (
        <Card className="w-full overflow-hidden p-0 min-h-[12rem] rounded-sm bg-card border-card-border">
            <div className="flex gap-6 items-stretch">
                {book.image_url ? (
                    <img
                        src={book.image_url}
                        alt={book.title}
                        className="object-cover w-36 h-auto"
                    />
                ) : (
                    <div className="w-36 aspect-[2/3] bg-gray-200"/>
                )}

                <div className="flex flex-col justify-center pr-6 py-4 space-y-3">
                    <Link
                        to={`/books/${book.id}`}
                        className="text-xl font-semibold hover:text-muted-foreground tracking-wide"
                    >{book.title}</Link>

                    <div>
                        {authors.map((author, index) => (
                            <span key={author}>
                                <Link
                                    to={`/search?author=${encodeURIComponent(author)}`}
                                    className="text-secondary-foreground hover:text-muted-foreground font-light"
                                >{author}</Link>
                                {index < authors.length - 1 && ', '}
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

                    <div className="flex flex-wrap gap-1 mt-1">
                        {book.tags?.slice(0, 10).map((genre) => (
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

export default UpcomingCard;
