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
    let publishStr = "Published"
    if (edition.release_date) {
        const date = new Date(edition.release_date);
        const today = new Date();
        if (date > today) publishStr = "Publishing"
        formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    return (
        <Card className="w-full overflow-hidden p-0 min-h-[12rem] rounded-sm bg-card border-card-border">
            <div className="flex gap-6 items-stretch">
                {edition.image_url ? (
                    <div className="w-36 aspect-[2/3] bg-card shrink-0 rounded-sm">
                        <Link to={`/book/${edition.id}`} className="block w-full h-auto">
                            <img
                                src={edition.image_url}
                                alt={edition.title}
                                className="w-full h-full object-cover rounded-sm"
                            />
                        </Link>
                    </div>
                ) : (
                    <Link to={`/book/${edition.id}`} className="w-36 aspect-[2/3] rounded-sm flex-shrink-0 flex-grow-0">
                        <div className="w-36 aspect-[2/3] bg-slate-200 object-cover rounded-sm" />
                    </Link>
                )}
                <div className="flex flex-col justify-center pr-6 py-4 space-y-1">
                    <Link
                        to={`/book/${edition.id}`}
                        className="text-xl font-semibold hover:text-muted-foreground tracking-wide text-slate-200 pb-3"
                    >{edition.title}</Link>
                    <div className="text-muted-foreground text-sm font-light">
                        {publishStr} {formattedDate} {edition.publisher_name ? "by" : null} {edition.publisher_name}
                    </div>
                    <div className="text-muted-foreground text-sm font-light">
                        {edition.pages} {edition.pages ? "pages" : null}{edition.edition_information ? "," : null} {edition.edition_information}
                    </div>
                    <div>
                        {authors.map((author, index) => (
                            <span key={author} className="inline-flex items-center pr-1">
                                <Link
                                    to={`/author/${edition.contributors?.[index].id}`}
                                    className="text-muted-foreground text-sm font-light hover:text-card-muted-foreground"
                                >{author}</Link>
                                <div className="text-muted-foreground">{index < authors.length - 1 && ', '}</div>
                            </span>
                        ))}
                    </div>
                    <div className="text-muted-foreground text-sm font-light">
                        Edition language: {edition.language.replace(";", ",")}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default EditionCard;
