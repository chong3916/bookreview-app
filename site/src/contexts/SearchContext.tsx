import React from "react"

export type SearchContextType = {
    query: string,
    title: string,
    author: string,
    subject: string,
    page: number
}

export const SearchContext = React.createContext<{
    searchData: SearchContextType;
    setSearchData: React.Dispatch<React.SetStateAction<SearchContextType>>;
} | null>(null);

const { Provider } = SearchContext;

export const SearchContextProvider = ({ children }: any) => {
    const [searchData, setSearchData] = React.useState<SearchContextType>({
        query: "",
        title: "",
        author: "",
        subject: "",
        page: 1
    });

    const contextValue = {
        searchData,
        setSearchData
    }

    return <Provider value={contextValue}>{children}</Provider>
}

export const useSearchContext = () => {
    const context = React.useContext(SearchContext);
    if (context === undefined || context == null) {
        throw new Error('useSearchContext must be used within a SearchContextProvider');
    }
    return context;
};