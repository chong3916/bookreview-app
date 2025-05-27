import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import type BookDetailModel from "@/components/types/BookDetailModel.ts";
import EditionsCarousel from "@/components/EditionsCarousel.tsx";
import { Link } from "react-router";

interface SearchDetailsTabsProps {
    bookDetails: BookDetailModel
}

const BookDetailsTabs: React.FC<SearchDetailsTabsProps> = ({ bookDetails }) => {
    const date = new Date(bookDetails.release_date);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Tabs defaultValue="bookinfo">
            <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b !bg-transparent p-0">
                <TabsTrigger value="bookinfo" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                    Book Info
                </TabsTrigger>
                <TabsTrigger value="editions" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-primary data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none cursor-pointer" >
                    Editions
                </TabsTrigger>
            </TabsList>
            <div className="relative min-h-[450px]">
                <div className="hidden md:block"> {/* Desktop: scrollable */}
                    <TabsContent value="bookinfo" className="relative w-full h-[450px] overflow-auto">
                        <div className="px-4 pt-2">
                            <ScrollArea className="h-full w-full font-light">{bookDetails.description}</ScrollArea>
                            <div className="flex flex-wrap gap-1 pt-5 items-center">
                                <div className="mr-1 text-tabs-muted-foreground font-medium text-sm tracking-wide">GENRES</div>
                                {bookDetails.tags?.map((tag, i: number) => (
                                    <Badge key={i} variant="outline" className="text-badge-foreground hover:text-badge-hover cursor-pointer font-extralight text-sm"
                                           style={{borderRadius: '3px'}}>
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </div>
                <div className="block md:hidden"> {/* Mobile: collapsible */}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="description">
                            <AccordionTrigger className="text-left">Description</AccordionTrigger>
                            <AccordionContent className="font-light">
                                {bookDetails.description}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <TabsContent value="editions" className="absolute inset-0 transition-opacity duration-300 data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none">
                    <div className="px-4 pt-2">
                        <div className="ml-1 w-full">
                            {/* This edition details */}
                            <div className="grid grid-cols-8 gap-y-1.5 text-sm items-start">
                                {/* Format */}
                                <div className="col-span-1 text-tabs-muted-foreground">Format:</div>
                                <div className="col-span-7 text-tabs-foreground">
                                    <span>{bookDetails.pages} pages</span>
                                    {bookDetails.this_edition.edition_information && (
                                        <span>, {bookDetails.this_edition.edition_information}</span>
                                    )}
                                </div>

                                {/* Published */}
                                <div className="text-tabs-muted-foreground col-span-1">Published:</div>
                                <div className="col-span-7 text-tabs-foreground">
                                    {bookDetails.release_date && <span>{formattedDate}</span>}
                                    {bookDetails.release_date && bookDetails.this_edition.publisher_name && <span> </span>}
                                    {bookDetails.this_edition.publisher_name && (
                                        <span>by {bookDetails.this_edition.publisher_name}</span>
                                    )}
                                </div>

                                {/* ASIN / ISBN10 / ISBN13 */}
                                {bookDetails.this_edition.asin ? <div className="text-tabs-muted-foreground col-span-1">ASIN:</div>
                                    : (bookDetails.this_edition.isbn_13 ? <div className="text-tabs-muted-foreground col-span-1">ISBN13:</div>
                                    : (bookDetails.this_edition.isbn_10 ? <div className="text-tabs-muted-foreground col-span-1">ISBN10:</div> : null))
                                }
                                {bookDetails.this_edition.asin || bookDetails.this_edition.isbn_13 || bookDetails.this_edition.isbn_10 ?
                                    <div className="col-span-7 text-tabs-foreground">
                                        {bookDetails.this_edition.asin ? <span>{bookDetails.this_edition.asin}</span>
                                            : (bookDetails.this_edition.isbn_13 ? <span>{bookDetails.this_edition.isbn_13}</span>
                                                : (bookDetails.this_edition.isbn_10 ? <span>{bookDetails.this_edition.isbn_10}</span> : null))
                                        }
                                    </div> : null}

                                {bookDetails.this_edition.language ? <div className="text-tabs-muted-foreground col-span-1">Language:</div> : null}
                                {bookDetails.this_edition.language ?
                                    <div className="col-span-7 text-tabs-foreground"><span>{bookDetails.this_edition.language}</span></div> : null}
                            </div>

                        </div>
                        <div className="tracking-wide mt-3 text-tabs-foreground">Other Editions</div>
                        <EditionsCarousel editions={bookDetails.editions} title={bookDetails.title}/>
                        <Link to={`/editions/${bookDetails.id}`} className="flex items-center text-secondary-foreground hover:text-secondary-foreground/70 ml-1">View all {bookDetails.editions_count} editions <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-1 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg></Link>
                    </div>
                </TabsContent>
            </div>
        </Tabs>
    )
}

export default BookDetailsTabs
