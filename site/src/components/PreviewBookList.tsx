import type {PreviewBookModel} from "@/components/types/BookListModel.ts";
import {Link, useNavigate} from "react-router";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";

const PreviewBookList: React.FC<{ previewBookList: PreviewBookModel[], listId: number }> = ({ previewBookList, listId }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-row gap-x-8">
            {previewBookList.map((book, index) => {
                const authors: string[] = book.authors.map((author) => {
                    const name = author.name;
                    const contribution = author.contribution;
                    return contribution ? `${name} (${contribution})` : name;
                }) ?? [];

                return (
                    <TooltipProvider key={index}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {book.image_url ? (
                                    <div className="w-32 aspect-[2/3] bg-card shrink-0">
                                        <Link to={`/book/${book.id}`} className="block w-full h-auto">
                                            <img
                                                src={book.image_url}
                                                alt={book.title}
                                                className="w-full h-full object-cover border-2 border-transparent hover:border-accent"
                                            />
                                        </Link>
                                    </div>
                                ) : (
                                    <Link to={`/book/${book.id}`}
                                          className="w-32 aspect-[2/3] flex-shrink-0 flex-grow-0">
                                        <div className="w-32 aspect-[2/3] bg-slate-200 object-cover "/>
                                    </Link>
                                )
                                }
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-indigo-600 text-white max-w-xs"
                                sideOffset={8}
                                side="top"
                            >
                                <div className="font-medium whitespace-normal break-words mb-1">
                                    {book.title}
                                </div>
                                <div className="text-secondary-foreground max-w-xs whitespace-normal break-words">
                                    {authors.slice(0, 3).join(", ")}
                                    {authors.length > 3 && "…"}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            })}
            {previewBookList.length > 5 ?
                <Button className="self-center w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" onClick={() => navigate(`/list/${listId}`)}>
                    <Plus/>
                </Button> : null}
        </div>
    )
}

export default PreviewBookList;
