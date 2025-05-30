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
}

export const AuthContext = React.createContext<{
    authData: AuthContextType;
    setAuthData: React.Dispatch<React.SetStateAction<AuthContextType>>;
    logout: () => void;
    refreshBookLists: () => Promise<void>;
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
    });

    const logout = async () => {
        await auth.logout();
        setAuthData({...authData, email: '', accessToken: null, firstName: '', lastName: '', avatar: null, book_lists: []})
    }

    const refreshBookLists = async () => {
        if (!authData.accessToken) return;
        const user = await auth.getCurrentUser(authData.accessToken);
        setAuthData(prev => ({ ...prev, book_lists: user.book_lists }));
    }

    const contextValue = {
        authData,
        setAuthData,
        logout,
        refreshBookLists
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
            setAuthData({...authData, email: user.email, accessToken: accessToken, firstName: user.first_name, lastName: user.last_name, avatar: user.avatar, book_lists: user.book_lists})
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