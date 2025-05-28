import React, {useEffect} from "react";
import {auth} from "@/api/auth.ts";

export type AuthContextType = {
    firstName: string,
    lastName: string,
    email: string,
    accessToken: string | null,
    avatar: string | null
}

export const AuthContext = React.createContext<{
    authData: AuthContextType;
    setAuthData: React.Dispatch<React.SetStateAction<AuthContextType>>;
    logout: () => void;
} | null>(null);

const { Provider } = AuthContext;

export const AuthContextProvider = ({ children }: any) => {
    const [authData, setAuthData] = React.useState<AuthContextType>({
        firstName: '',
        lastName: '',
        email: '',
        accessToken: null,
        avatar: null
    });

    const logout = async () => {
        await auth.logout();
        setAuthData({...authData, email: '', accessToken: null, firstName: '', lastName: '', avatar: null})
    }

    const contextValue = {
        authData,
        setAuthData,
        logout
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
            setAuthData({...authData, email: user.email, accessToken: accessToken, firstName: user.first_name, lastName: user.last_name, avatar: user.avatar})
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