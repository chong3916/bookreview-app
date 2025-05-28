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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import React, {useEffect, useState} from "react";
import {auth} from "@/api/auth.ts";
import {Link} from "react-router";

const AddBookButton: React.FC<{bookId: number}> = ({ bookId }) => {
    const {authData, setAuthData, refreshBookLists} = useAuthContext();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleAddBook = async (listId: number) => {
        try {
            await bookListService.addBookToList(authData.accessToken, listId, bookId)
            await refreshBookLists()
        } catch (e) {
            console.error("Adding book failed", e);
        }
    }

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) {
            setEmail("");
            setPassword("");
        }
    }, [open])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response  = await auth.login(email, password);
        try {
            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            const accessToken = data.access;

            const user = await auth.getCurrentUser(accessToken);

            setAuthData({...authData, email: user.email, accessToken: accessToken, firstName: user.first_name, lastName: user.last_name, avatar: user.avatar, book_lists: user.book_lists})
            await refreshBookLists()
        } catch (e) {
            console.error("Login failed. Please check your credentials.");
        }
    }


    return (
        <div>
        {authData.accessToken ?
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="cursor-pointer bg-primary w-48 h-12">WANT TO READ</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Add Book to List</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    { authData.book_lists.map((list) => {
                            const alreadyAdded = list.book_ids.includes(bookId);
                            return (<DropdownMenuCheckboxItem
                                key={list.id}
                                onCheckedChange={() => handleAddBook(list.id)}
                                checked={alreadyAdded}
                                disabled={alreadyAdded}
                                className="cursor-pointer"
                            >
                                {list.name}
                            </DropdownMenuCheckboxItem>)
                        }
                    )}
                </DropdownMenuContent>
            </DropdownMenu> :
            <Dialog open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                    setEmail("");
                    setPassword("");
                }
            }}
            >
                <DialogTrigger asChild>
                    <Button className="cursor-pointer bg-primary w-48 h-12">WANT TO READ</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Login</DialogTitle>
                            <DialogDescription>
                                Enter your email below to login to your account
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       required />
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link to="/signup" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                        <DialogFooter className="grid grid-cols-2 sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer">
                                Login
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        }
        </div>
    )
}

export default AddBookButton;
