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
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import React, { useState } from "react";
import {bookListService} from "@/api/bookList.ts";
import {useAuthContext} from "@/contexts/AuthContext.tsx";

const EditListButton: React.FC<{listId: number, currentName: string, currentDescription: string | null, currentIsPublic: boolean}> = ({listId, currentName, currentDescription, currentIsPublic}) => {
    const {authData, refreshBookLists} = useAuthContext();

    const [open, setOpen] = useState<boolean>(false);

    const [name, setName] = useState<string>(currentName);
    const [description, setDescription] = useState<string>(currentDescription ? currentDescription : "");
    const [isPublic, setIsPublic] = useState<boolean>(currentIsPublic);

    const handleSubmit = async () => {
        try {
            await bookListService.editList(authData.accessToken, listId, name, description, isPublic);
            setOpen(false);
            await refreshBookLists();
        } catch (e) {
            console.error("Failed to create list: ", e)
            // TODO: ERROR MESSAGE
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                setName(currentName);
                setDescription(currentDescription ? currentDescription : "");
                setIsPublic(currentIsPublic);
            }
        }}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit List</DialogTitle>
                        <DialogDescription>
                            Enter new information about the list
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
                            Edit list
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditListButton;
