import React, { useState } from "react";
import {auth} from "../api/auth.ts";
import {
    Card,
    CardContent, CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {cn} from "@/lib/utils.ts";
import {Link} from "react-router";

const LoginPage: React.FC<{}> = () => {
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

            setAuthData({...authData, email: user.email, accessToken: accessToken, firstName: user.first_name, lastName: user.last_name, avatar: user.avatar})
        } catch (e) {

        }

    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
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
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                    {/*<Button variant="outline" className="w-full">*/}
                                    {/*    Login with Google*/}
                                    {/*</Button>*/}
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link to="/signup" className="underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;