import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import React, {useEffect, useState} from "react";
import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {bookListService} from "@/api/bookList.ts";

const CreateNewListButton: React.FC<{}> = () => {
    const { authData } = useAuthContext();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) {
            setName("");
            setDescription("");
            setIsPublic(false);
        }
    }, [open])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await bookListService.createList(authData.accessToken, name, description, isPublic, []);
            setOpen(false);
        } catch (e) {
            console.error("Failed to create list: ", e)
            // TODO: ERROR MESSAGE
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer hover:text-primary-foreground/50">New list</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create new list</DialogTitle>
                        <DialogDescription>
                            Enter information about this list.
                        </DialogDescription>
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
                            <div className="flex items-center">
                                <Label htmlFor="description">Description</Label>
                            </div>
                            <Textarea id="description" placeholder="Write a few sentences about your list..."
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}/>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Switch
                                id="isPublic"
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                            <div>
                                <Label htmlFor="isPublic">Public <span className="text-muted-foreground font-light text-sm">(You can modify this later)</span></Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">
                            Create list
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateNewListButton;
