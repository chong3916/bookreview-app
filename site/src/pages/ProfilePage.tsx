import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {useEffect, useState} from "react";
import type BookListModel from "@/components/types/BookListModel.ts";
import {bookListService} from "@/api/bookList.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import * as React from "react";
import CreateNewListButton from "@/components/CreateNewListButton.tsx";
import {Link} from "react-router";
import {Badge} from "@/components/ui/badge"
// import {testBookList} from "@/bookListFixtures.ts";
import PreviewBookList from "@/components/PreviewBookList.tsx";
import EditProfileButton from "@/components/EditProfileButton.tsx";
import {Eye, EyeOff} from "lucide-react";

const ProfilePage: React.FC<{}> = () => {
    const { authData } = useAuthContext();
    const [bookLists, setBookLists] = useState<BookListModel[]>([])
    const [totalLists, setTotalLists] = useState<number>(0)

    useEffect(() => {
        // setBookLists(testBookList)
        if (!authData.accessToken) return
        // TODO: GET MORE USER DETAILS (FOLLOWERS/FRIENDS, REVIEWS, ETC)
        getUserLists()
    }, [authData.accessToken, authData.book_lists])

    const getUserLists = async () => {
        try {
            const response = await bookListService.getCurrentUserLists(authData.accessToken);
            setBookLists(response.results);
            setTotalLists(response.count)
            console.log(response)
            // setBookLists(testBookList)
        } catch (e) {
            console.error("Fetching profile failed", e);
        }
    }

    return (
        <div className="grid gap-y-8 py-10 mx-auto w-2/3 mt-20">
            <div className="grid grid-cols-10 gap-y-1.5 items-start">
                {/* User's info */}
                <div className="col-span-3 flex flex-col gap-y-2 min-h-[24rem]">
                    <Avatar className="w-2/3 h-auto ">
                        {authData.avatar ? <AvatarImage src={authData.avatar} /> : <AvatarFallback>CN</AvatarFallback>}
                    </Avatar>
                    <div className="w-2/3 text-center">
                        <div className="text-xs font-light text-muted-foreground">RATINGS</div>
                        <div className="text-xs font-light text-muted-foreground">REVIEWS</div>
                    </div>
                    <EditProfileButton/>
                </div>
                <div className="col-span-7 flex flex-col gap-y-3">
                    <div className="text-2xl tracking-wide">{authData.firstName} {authData.lastName}</div>
                    <Separator/>
                    <div><span className="text-muted-foreground">Details:</span> {authData.bio}</div>
                </div>
            </div>
            {/* User's bookshelves */}
            <div className="flex flex-col gap-y-3">
                <div className="grid grid-cols-2 gap-y-1.5 items-center mr-20">
                    <div>{authData.firstName.toUpperCase()}'S BOOKSHELVES</div>
                    <div className="w-10 justify-self-end"><CreateNewListButton/></div>
                </div>
                <Separator className="mb-8"/>
                {bookLists.map((list) =>
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
        </div>
    )
}

export default ProfilePage;
