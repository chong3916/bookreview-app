import React from "react";
import { Link } from "react-router";
import {useAuthContext} from "@/contexts/AuthContext.tsx";
import { Button } from "@/components/ui/button"

const HomePage: React.FC<{}> = () => {
    const { authData, logout } = useAuthContext();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-600">
            <div className="flex flex-col space-y-4 text-center">
                <div>{authData.firstName}</div>
                <Link to="/signup">Sign up</Link><br/>
                <Link to="/login">Login</Link><br/>
                <Button onClick={logout}>Log out</Button>
            </div>
        </div>
    );
}

export default HomePage;