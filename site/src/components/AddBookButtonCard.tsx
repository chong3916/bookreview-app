import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
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
import {Textarea} from "@/components/ui/textarea.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Plus} from "lucide-react";

const AddBookButtonCard: React.FC<{bookId: number}> = ({ bookId }) => {
    const {authData, setAuthData, refreshBookLists, getCurrentUser} = useAuthContext();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [openLogin, setOpenLogin] = useState(false)

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [openNewList, setOpenNewList] = useState(false)

    const handleAddBook = async (listId: number) => {
        try {
            await bookListService.addBookToList(authData.accessToken, listId, Number(bookId))
            await refreshBookLists()
        } catch (e) {
            console.error("Adding book failed", e);
        }
    }

    const handleNewList = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await bookListService.createList(authData.accessToken, name, description, isPublic, []);
            setOpenNewList(false);
            await refreshBookLists();
        } catch (e) {
            console.error("Failed to create list: ", e)
            // TODO: ERROR MESSAGE
        }
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response  = await auth.login(email, password);
        try {
            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            const accessToken = data.access;
            setAuthData(prev => ({ ...prev, accessToken }));
            await getCurrentUser(accessToken);
            setOpenLogin(false);
        } catch (e) {
            console.error("Login failed. Please check your credentials.");
        }
    }


    return (
        <div>
        {authData.accessToken ?
            <Dialog open={openNewList} onOpenChange={(isOpen) => {
                setOpenNewList(isOpen);
                if (!isOpen) {
                    setName("");
                    setDescription("");
                    setIsPublic(false);
                }
            }}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="cursor-pointer bg-primary w-48 h-12">WANT TO READ</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Add Book to List</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {authData.book_lists.map((list) => {
                            const alreadyAdded = list.book_ids.includes(Number(bookId));
                            return (
                                <DropdownMenuCheckboxItem
                                    key={list.id}
                                    onCheckedChange={() => handleAddBook(list.id)}
                                    checked={alreadyAdded}
                                    disabled={alreadyAdded}
                                    className="cursor-pointer"
                                >
                                    {list.name}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                        {authData.book_lists.length > 0 ? <DropdownMenuSeparator /> : null}

                        <DropdownMenuItem
                            className="flex items-center gap-x-2 pl-2 pr-2 h-8 text-sm text-foreground cursor-pointer"
                            onSelect={(e) => {
                                e.preventDefault();
                                setOpenNewList(true);
                            }}
                        >
                            <Plus className="w-4 h-4 text-muted-foreground" />
                            New Bookshelf
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Create new list dialog content */}
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleNewList}>
                        <DialogHeader>
                            <DialogTitle>Create new list</DialogTitle>
                            <DialogDescription>Enter information about this list.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">List Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Write a few sentences about your list..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
                                <Label htmlFor="isPublic">
                                    Public <span className="text-muted-foreground font-light text-sm">(You can modify this later)</span>
                                </Label>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Create list</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            :
            <Dialog open={openLogin} onOpenChange={(isOpen) => {
                setOpenLogin(isOpen);
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
                    <form onSubmit={handleLogin}>
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

export default AddBookButtonCard;
