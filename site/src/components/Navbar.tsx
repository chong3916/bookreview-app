import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {Link, useNavigate} from "react-router";
import SearchBar from "@/components/SearchBar.tsx";
import {useAuthContext} from "@/contexts/AuthContext.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Button} from "@/components/ui/button.tsx";
import * as React from "react"
import {CalendarCheck, TrendingUp} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar: React.FC<{}> = () => {
    const { authData, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
        navigate("/");
    }

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-5 py-4 border-b shadow-sm bg-navbar-background border-navbar-background">
            <div className="grid grid-cols-2 items-center">
                {/* Left side: Logo */}
                <div>
                    <Link to="/" className="text-3xl font-semibold tracking-wide">pagebound</Link>
                </div>

                {/* Right side */}
                <div className="flex justify-end items-center gap-6">
                    <SearchBar />

                    <NavigationMenu>
                        <NavigationMenuList className="gap-4">
                            <NavigationMenuItem>
                                <div className="relative inline-block">
                                <NavigationMenuTrigger className="cursor-pointer bg-navbar-accent hover:bg-foreground/5 data-[state=open]:bg-foreground/10 focus:bg-foreground/10 text-foreground rounded-md px-4 py-2 transition-colors">
                                    Discover
                                </NavigationMenuTrigger>
                                <NavigationMenuContent align={authData.accessToken ? "right" : "left"}>
                                    <ul className="grid gap-3 w-48 py-2 px-1">
                                        <li>
                                            <NavigationMenuLink asChild className="flex">
                                                <Link to="/trending" className="group flex items-center gap-2 text-sm p-2 rounded-md">
                                                    <div className="w-10 h-10 p-2 rounded-md border bg-foreground/5 border-background text-[#22c55e] group-hover:bg-[#22c55e] group-hover:border-[#22c55e] group-hover:text-background transition-colors">
                                                        <TrendingUp className="w-full h-full stroke-current" />
                                                    </div>
                                                    Trending Books
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild className="flex">
                                                <Link to="/upcoming" className="group flex items-center gap-2 text-sm p-2 rounded-md">
                                                    <div className="w-10 h-10 p-2 rounded-md border bg-foreground/5 border-background text-[#22c55e] group-hover:bg-[#22c55e] group-hover:border-[#22c55e] group-hover:text-background transition-colors">
                                                        <CalendarCheck className="w-full h-full stroke-current" />
                                                    </div>
                                                    New Releases
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                                </div>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                {authData.accessToken ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="cursor-pointer pointer-events-auto">
                                                <Avatar>
                                                    {authData.avatar ? <AvatarImage src={authData.avatar} /> : <AvatarFallback>CN</AvatarFallback>}
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel className="cursor-default">{authData.firstName}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile/lists")}>My Lists</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile/followers")}>Followers</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleLogout()}>Logout</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <NavigationMenuItem>
                                        <Button asChild>
                                            <Link to="/login" className="text-sm">Login</Link>
                                        </Button>
                                    </NavigationMenuItem>
                                )}
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
