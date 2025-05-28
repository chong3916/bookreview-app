import {useAuthContext} from "@/contexts/AuthContext.tsx";
import React, {useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {bookListService} from "@/api/bookList.ts";

const CreateBookListForm: React.FC<{}> = () => {
    const { authData } = useAuthContext();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await bookListService.createList(authData.accessToken, name, description, isPublic, []);
        } catch (e) {
            console.error("Failed to create list: ", e)
            // TODO: ERROR MESSAGE
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
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
                <Button type="submit" className="w-full cursor-pointer">
                    Create list
                </Button>
            </div>
        </form>
    )
}

export default CreateBookListForm;
