import type {AuthorBookModel} from "@/components/types/AuthorDetailModel.ts";
import {Link} from "react-router";
import StarRating from "@/components/StarRating.tsx";

const AuthorBookCard: React.FC<{book: AuthorBookModel}> = ({ book }) => {
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
                    <img
                        src={book.image_url}
                        alt={book.title}
                        className="object-cover w-20 h-auto"
                    />
                ) : (
                    <div className="w-20 aspect-[2/3] bg-gray-200"/>
                )}

                <div className="flex flex-col justify-center pr-6 py-4 space-y-3">
                    <Link
                        to={`/book/${book.id}`}
                        className="text-base font-semibold hover:text-muted-foreground tracking-wide"
                    >{book.title}</Link>

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

export default AuthorBookCard;
