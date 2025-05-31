import {Link, useParams, useSearchParams} from "react-router";
import React, {useEffect, useState} from "react";
import PaginationControls from "@/components/PaginationControls.tsx";
import type BookListModel from "@/components/types/BookListModel.ts";
import {bookListService} from "@/api/bookList.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {Eye, EyeOff} from "lucide-react";
import PreviewBookList from "@/components/PreviewBookList.tsx";
import {useAuthContext} from "@/contexts/AuthContext.tsx";

const UserListsPage: React.FC<{}> = () => {
    const { authData } = useAuthContext()

    const { userId } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);

    const [loading, setLoading] = useState<boolean>(false);

    const [results, setResults] = useState<BookListModel[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1)

    useEffect(() => {
        getLists()
    }, [userId, page]);

    const getLists = async () => {
        if (!userId) {
            console.warn("No userId provided. Skipping fetch.");
            return;
        }

        try {
            setLoading(true);
            const response = await bookListService.getAllUsersLists(authData.accessToken, userId, page);
            setResults(response.results);
            setTotalPages(Math.ceil(response.count / 5));
        } catch (e) {

        } finally {
            setLoading(false);
        }
    }

    const goToPage = (newPage: number) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
    };

    return (
        <div className="mt-30 w-3/4 mx-auto">
            {loading ? (
                <div className="text-center text-muted-foreground py-10">Loading...</div>
            ) : (
                <div className="flex flex-col space-y-10">
                    <Link to={`/user/${userId}`} className="text-2xl tracking-wide">{results.length > 0 ? results[0].owner_first_name.toUpperCase() : null}'S LISTS</Link>
                    {results.map((list) =>
                        <div key={list.id} className="min-h-[12rem] flex flex-col gap-y-4">
                            <div className="flex flex-row gap-x-2 items-center">
                                <Link to={`/list/${list.id}`}>{list.name}</Link>
                                {list.isPublic ? <Badge className="bg-accent font-light text-accent-foreground rounded-lg h-5"><Eye /> Public</Badge>
                                    : <Badge className="font-light rounded-lg h-5"><EyeOff /> Private</Badge>}
                            </div>
                            {list.preview_books ? <PreviewBookList previewBookList={list.preview_books} listId={list.id}/> : null}
                        </div>
                    )}
                </div>
            )}
            <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
            />
        </div>
    )
}

export default UserListsPage;
