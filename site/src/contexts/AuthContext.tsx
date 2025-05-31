import React, {useEffect} from "react";
import {auth} from "@/api/auth.ts";

type BookList = {
    id: number,
    name: string,
    description: string | null,
    book_ids: number[],
    isPublic: boolean
}

export type AuthContextType = {
    firstName: string,
    lastName: string,
    email: string,
    accessToken: string | null,
    avatar: string | null,
    book_lists: BookList[],
    id: string | null,
    bio: string | null
}

export const AuthContext = React.createContext<{
    authData: AuthContextType;
    setAuthData: React.Dispatch<React.SetStateAction<AuthContextType>>;
    logout: () => void;
    refreshBookLists: () => Promise<void>;
    getCurrentUser: (tokenOverride?: string) => Promise<void>;
} | null>(null);

const { Provider } = AuthContext;

export const AuthContextProvider = ({ children }: any) => {
    const [authData, setAuthData] = React.useState<AuthContextType>({
        firstName: '',
        lastName: '',
        email: '',
        accessToken: null,
        avatar: null,
        book_lists: [],
        id: null,
        bio: null
    });

    const logout = async () => {
        await auth.logout();
        setAuthData(prev => ({ ...prev, email: '', accessToken: null, firstName: '', lastName: '', avatar: null, book_lists: [], id: null, bio: null }));
    }

    const refreshBookLists = async () => {
        if (!authData.accessToken) return;
        const user = await auth.getCurrentUser(authData.accessToken);
        setAuthData(prev => ({ ...prev, book_lists: user.book_lists }));
    }

    const getCurrentUser = async (tokenOverride?: string) => {
        const token = tokenOverride || authData.accessToken;
        if (!token) return;

        try {
            const user = await auth.getCurrentUser(token);
            console.log(user)
            setAuthData(prev => ({ ...prev, email: user.email, firstName: user.first_name, lastName: user.last_name, avatar: user.avatar, book_lists: user.book_lists, id: user.id, bio: user.bio }));
        } catch (e: any) {
            if (e.message === 'Failed to fetch current user') {
                try {
                    const refreshed = await auth.refreshToken();
                    const user = await auth.getCurrentUser(refreshed.access);
                    setAuthData(prev => ({
                        ...prev,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        avatar: user.avatar,
                        book_lists: user.book_lists,
                        id: user.id,
                        bio: user.bio,
                        accessToken: refreshed.access,
                    }));
                } catch {
                    console.log("User not logged in, or refresh token expired");
                    logout();
                }
            }
        }
    }

    const contextValue = {
        authData,
        setAuthData,
        logout,
        refreshBookLists,
        getCurrentUser
    }

    const hasRefreshed = React.useRef(false);

    useEffect(() => {
        if (hasRefreshed.current) return;
        hasRefreshed.current = true;
        tryRefresh();
    }, []);

    const tryRefresh = async () => {
        try {
            console.log("Refreshing token");
            const refreshed = await auth.refreshToken();
            const accessToken = refreshed.access;
            const user = await auth.getCurrentUser(accessToken);
            setAuthData(prev => ({ ...prev, email: user.email, accessToken: accessToken, firstName: user.first_name, lastName: user.last_name, avatar: user.avatar, book_lists: user.book_lists, id: user.id, bio: user.bio}));
        } catch (e) {
            console.log("No valid refresh token");
        }
    };

    return <Provider value={contextValue}>{children}</Provider>
}

export const useAuthContext = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined || context == null) {
        throw new Error('useAuthContext must be used within a AuthContextProvider');
    }
    return context;
};