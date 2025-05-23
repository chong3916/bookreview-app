import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import type BookDetailModel from "@/components/types/BookDetailModel.ts";

interface SearchDetailsTabsProps {
    bookDetails: BookDetailModel
}

const BookDetailsTabs: React.FC<SearchDetailsTabsProps> = ({ bookDetails }) => {
    return (
        <Tabs defaultValue="bookinfo">
            <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b !bg-transparent p-0">
                <TabsTrigger value="bookinfo" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-indigo-500 data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none " >
                    Book Info
                </TabsTrigger>
                <TabsTrigger value="editions" className="relative rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold
                                                                            text-muted-foreground shadow-none transition-none focus-visible:ring-0
                                                                            data-[state=active]:!border-b-indigo-500 data-[state=active]:border-t-0
                                                                            data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:border-b-2
                                                                            data-[state=active]:text-foreground data-[state=active]:shadow-none " >
                    Editions
                </TabsTrigger>
            </TabsList>
            <div className="relative min-h-[200px]">
                <div className="hidden md:block"> {/* Desktop: scrollable */}
                    <TabsContent value="bookinfo" className="relative w-full h-[300px] overflow-auto">
                        <div>
                            <ScrollArea className="h-[200px] w-full font-light">{bookDetails.description}</ScrollArea>
                            <div className="flex flex-wrap gap-1 pt-5 items-center">
                                <div className="mr-1 text-slate-500 font-medium text-sm tracking-wide">GENRES</div>
                                {bookDetails.tags?.map((tag, i: number) => (
                                    <Badge key={i} variant="outline" className="text-indigo-400 font-extralight text-sm"
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
                <TabsContent value="editions" className="relative w-full h-[300px] overflow-auto">
                    EDITIONS
                </TabsContent>
            </div>
        </Tabs>
    )
}

export default BookDetailsTabs
