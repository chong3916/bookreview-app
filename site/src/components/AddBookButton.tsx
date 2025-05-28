import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {bookListService} from "@/api/bookList.ts";

const AddBookButton: React.FC<{bookId: number}> = ({ bookId }) => {
    const {authData} = useAuthContext();

    const handleAddBook = async (listId: number) => {
        try {
            bookListService.addBookToList(authData.accessToken, listId, bookId)
        } catch (e) {
            console.error("Adding book failed", e);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Add Book</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Add Book to List</DropdownMenuLabel>
                <DropdownMenuSeparator />
                { authData.book_lists.map((list) =>
                    <DropdownMenuCheckboxItem
                        onCheckedChange={() => handleAddBook(list.id)}
                        checked={list.book_ids.includes(bookId)}
                        disabled={list.book_ids.includes(bookId)}
                    >
                        {list.name}
                    </DropdownMenuCheckboxItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AddBookButton;
