import type EditionModel from "@/components/types/EditionModel.ts";
import {Link} from "react-router";
import {Card} from "@/components/ui/card.tsx";

interface EditionCardProps {
    edition: EditionModel
}
const EditionCard: React.FC<EditionCardProps> = ({ edition }) => {
    const authors: string[] = edition.contributors?.map((contributor) => {
        const name = contributor.name;
        const contribution = contributor.contribution;
        return contribution ? `${name} (${contribution})` : name;
    }) ?? [];

    let formattedDate = null;
    if (edition.release_date) {
        const date = new Date(edition.release_date);
        formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    return (
        <Card className="w-full overflow-hidden p-0 bg-slate-900 min-h-[12rem] rounded-sm">
            <div className="flex gap-6 items-stretch">
                {edition.image_url ? (
                    <img
                        src={edition.image_url}
                        alt={edition.title}
                        className="object-cover w-36"
                    />
                ) : (
                    <div className="w-36 aspect-[2/3] bg-gray-200"/>
                )}
                <div className="flex flex-col justify-center pr-6 py-4 space-y-1">
                    <Link
                        to={`/books/${edition.book_id}`}
                        className="text-xl font-semibold hover:text-muted-foreground tracking-wide text-slate-200 pb-3"
                    >{edition.title}</Link>
                    <div className="text-slate-300 text-sm font-light">
                        Published {formattedDate} by {edition.publisher_name}
                    </div>
                    <div className="text-slate-300 text-sm font-light">
                        {edition.pages} pages{edition.edition_information ? "," : null} {edition.edition_information}
                    </div>
                    <div>
                        {authors.map((author, index) => (
                            <span key={author}>
                                <Link
                                    to={`/search?author=${encodeURIComponent(author)}`}
                                    className="text-slate-300 text-sm font-light hover:text-muted-foreground"
                                >{author}</Link>
                                {index < authors.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                    <div className="text-slate-300 text-sm font-light">
                        Edition language: {edition.language.replace(";", ",")}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default EditionCard;
