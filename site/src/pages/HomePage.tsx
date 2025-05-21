import React from "react";
import { Link } from "react-router";

const HomePage: React.FC<{}> = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-600">
            <div className="flex flex-col space-y-4 text-center">
                <Link to="/signup">Sign up</Link><br/>
                <Link to="/login">Login</Link><br/>
            </div>
        </div>
    );
}

export default HomePage;