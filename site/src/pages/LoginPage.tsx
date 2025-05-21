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
import {useAuthContext} from "@/contexts/AuthContext.tsx";

const SignupPage: React.FC<{}> = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { authData, setAuthData } = useAuthContext();


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

            setAuthData({...authData, email: user.email, accessToken: accessToken, firstName: user.first_name, lastName: user.last_name})
        } catch (e) {

        }

    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-600 content-center">
            <Card className="max-w-sm m-auto">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
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
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required />
                            </div>
                        </div>


                        <Button color="light" className="cursor-pointer bg-gray-200 dark:bg-gray-600 text-black dark:text-white" type="submit">Login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default SignupPage;