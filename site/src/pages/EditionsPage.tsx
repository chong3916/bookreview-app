import {useParams, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import { bookService } from "@/api/book.ts";
import type EditionModel from "@/components/types/EditionModel.ts";
import {testEditions} from "../editionFixtures.ts";
import EditionCard from "@/components/EditionCard.tsx";
import PaginationControls from "@/components/PaginationControls.tsx";


const EditionsPage: React.FC<{}> = () => {
    const {editionId} = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const page = pageParam !== null ? Math.max(parseInt(pageParam), 1) : 1;

    const [editions, setEditions] = useState<EditionModel[]>([])
    const [totalPages, setTotalPages] = useState<number>(1)

    useEffect(() => {
        if (!editionId) return;

        getEditions();
    }, [editionId, page])

    const getEditions = async () => {
        if (!editionId) {
            return <div>Missing edition parameter in URL.</div>;
        }
        // try {
        //     const response = await bookService.getEditions(editionId, page);
        //     console.log(response)
        //     setTotalPages(response[0].editions_count ? Math.ceil(response[0].editions_count / 10) : 1)
        //     setEditions(response);
        // } catch (err) {
        //     console.error("Error fetching book details:", err);
        // }
        const response = testEditions
        setTotalPages(response[0].editions_count ? Math.ceil(response[0].editions_count / 10) : 1)
        setEditions(response)
    }

    const goToPage = (newPage: number) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
    };

    return (
        <div className="grid gap-y-8 py-10 mx-auto w-3/4">
            {editions.map((edition) => <EditionCard key={edition.id} edition={edition}/>)}
            <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
            />

        </div>
    )
}

export default EditionsPage;
