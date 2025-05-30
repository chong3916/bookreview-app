import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router";
import {bookListService} from "@/api/bookList.ts";
import type BookListModel from "@/components/types/BookListModel.ts";
import TrendingCard from "@/components/TrendingCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {testBookListDetail} from "@/bookListFixtures.ts";
import EditListButton from "@/components/EditListButton.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import * as React from "react";
import { formatDistanceToNow } from 'date-fns';
import {Separator} from "@/components/ui/separator.tsx";

const BookListPage: React.FC = () => {
    const { listId } = useParams(); // from URL like /lists/:listId
    const { authData } = useAuthContext();
    const [bookList, setBookList] = useState<BookListModel | null>(null);
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [isOwner, setIsOwner] = useState<boolean>(false);

    const timeSince = (dateString) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    };

    useEffect(() => {
        // if (!authData) return;
        //
        // if (!listId || !authData.accessToken) {
        //     setUnauthorized(true);
        //     setLoading(false);
        //     return;
        // }

        fetchBookList();
    }, [listId, authData]);

    const fetchBookList = async () => {
        setUnauthorized(false);
        setLoading(true);

        try {
            // const response = await bookListService.getBookList(authData.accessToken, listId);
            // setBookList(response);
            // setIsOwner(authData.id === response.owner_id);

            setBookList(testBookListDetail);
            setIsOwner(true);
        } catch (error) {
            setUnauthorized(true);
            console.error("Error fetching list", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (unauthorized) return <div className="text-center mt-20 text-red-600">You're not authorized to view this list.</div>;

    return (
        <div className="grid gap-y-2 py-10 mx-auto w-2/3 mt-20">
            <div className="flex items-center justify-between w-full">
                <div className="col-span-1 font-light text-muted-foreground">List by <Link to={`/user/${bookList?.owner_id}`} className="text-primary-foreground font-normal">{bookList?.owner_first_name} {bookList?.owner_last_name}</Link>
                    {bookList?.isPublic ? <Badge className="bg-accent font-light text-accent-foreground rounded-lg h-5">Public</Badge>
                        : <Badge className="font-light rounded-lg h-5">Private</Badge>}
                </div>
                <div className="col-span-1">
                    {isOwner && bookList ? <EditListButton listId={Number(listId)} currentName={bookList.name}
                                                           currentDescription={bookList.description} currentIsPublic={bookList.isPublic}/> : null}
                </div>
            </div>
            <div className="text-2xl font-bold tracking-wide">{bookList?.name}</div>
            <div className="flex flex-row space-x-2 items-center text-sm font-extralight text-muted-foreground">
                <div>{bookList?.last_updated ? "Updated " + timeSince(bookList.last_updated) :
                    "Created " + timeSince(bookList?.created_at)}</div>
                <Separator orientation="vertical"/>
                <div>{bookList?.total_books} book{bookList?.total_books && bookList?.total_books > 1 ? "s" : null}</div>
            </div>
            <div className="font-extralight">{bookList?.description}</div>
            {bookList?.book_details?.map((book) => <TrendingCard key={book.id} book={book}/>)}
            {bookList?.book_details?.length === 0 ? <div>There are no books is this list</div> : null}
        </div>
    );
};

export default BookListPage;
