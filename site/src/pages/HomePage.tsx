import React from "react";
import {useAuthContext} from "@/contexts/AuthContext.tsx";

const HomePage: React.FC<{}> = () => {
    const { authData } = useAuthContext();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col space-y-4 text-center">
                <div>{authData.firstName}</div>
            </div>
        </div>
    );
}

export default HomePage;