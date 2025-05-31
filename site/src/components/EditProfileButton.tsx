import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import React, {useEffect, useState} from "react";
import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {auth} from "@/api/auth.ts";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {Pencil} from "lucide-react";

const EditProfileButton: React.FC<{}> = () => {
    const {authData, getCurrentUser} = useAuthContext();

    const [open, setOpen] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bio, setBio] = useState<string>("");

    useEffect(() => {
        if (open && authData) {
            setFirstName(authData.firstName || "");
            setLastName(authData.lastName || "");
            setBio(authData.bio || "");
            setAvatarPreview(authData.avatar || null);
        }
    }, [open, authData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await auth.editProfile(authData.accessToken, firstName, lastName, bio, avatar);
            await getCurrentUser();
            setOpen(false);
        } catch (e) {
            console.error("Adding book failed", e);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file)); // Temporary preview
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                setFirstName("");
                setLastName("");
                setAvatar(null);
                setAvatarPreview(null);
                setBio("");
            }
        }}>
            <DialogTrigger asChild>
                <Button className="w-2/3 justify-self-center cursor-pointer"><Pencil />Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Enter information about your profile.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Write a few sentences about yourself..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="avatar">Profile Photo</Label>
                            {avatarPreview && (
                                <Avatar className="h-auto w-24">
                                    <AvatarImage src={avatarPreview} alt="Avatar Preview" />
                                </Avatar>
                            )}
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>
                    <DialogFooter className="grid grid-cols-2 sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="cursor-pointer">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">Edit Profile</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileButton;
