import React, { useState } from "react";
import {auth} from "../api/auth.ts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const SignupPage: React.FC<{}> = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await auth.signup(email, username, password);
        if(response.ok) {
            setUsername("");
            setEmail("");
            setPassword("");
            alert("Successful signup. Please check email to verify account.");
        }
        else {
            alert("Failed to signup. Please try again or login.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-600 content-center">
            <Card className="max-w-sm m-auto">
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                            </div>
                        </div>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} required />
                            </div>
                        </div>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required />
                            </div>
                        </div>


                        <Button color="light" className="cursor-pointer bg-gray-200 dark:bg-gray-600 text-black dark:text-white" type="submit">Sign up</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default SignupPage;