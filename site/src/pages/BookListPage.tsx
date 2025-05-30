import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {bookListService} from "@/api/bookList.ts";
import type BookListModel from "@/components/types/BookListModel.ts";
import TrendingCard from "@/components/TrendingCard.tsx";
import {Button} from "@/components/ui/button.tsx";

const BookListPage: React.FC = () => {
    const { listId } = useParams(); // from URL like /lists/:listId
    const { authData } = useAuthContext();
    const [bookList, setBookList] = useState<BookListModel | null>(null);
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        if (!authData) return;

        if (!listId || !authData.accessToken) {
            setUnauthorized(true);
            setLoading(false);
            return;
        }

        fetchBookList();
    }, [listId, authData]);

    const fetchBookList = async () => {
        setUnauthorized(false);
        setLoading(true);

        try {
            const response = await bookListService.getBookList(authData.accessToken, listId);
            console.log(response)
            setBookList(response);
            setIsOwner(authData.id === response.owner_id);
            console.log(authData.id);
            console.log(response.owner_id);
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
        <div className="grid gap-y-8 py-10 mx-auto w-2/3 mt-20">
            {isOwner ? <Button>Edit</Button> : null}
            <h1 className="text-2xl font-bold">{bookList?.name}</h1>
            <p>{bookList?.description}</p>
            {bookList?.book_details?.map((book) => <TrendingCard book={book}/>)}
        </div>
    );
};

export default BookListPage;
