import React from "react";
import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input.tsx";
import {useSearchContext} from "@/contexts/SearchContext.tsx";
import {useNavigate} from "react-router";


const SearchBar: React.FC<{}> = () => {
    const { searchData, setSearchData } = useSearchContext();
    const navigate = useNavigate();

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (searchData.query) params.append("q", searchData.query);
        if (searchData.title) params.append("title", searchData.title);
        if (searchData.author) params.append("author", searchData.author);
        if (searchData.subject) params.append("subject", searchData.subject);
        navigate(`/search?${params.toString()}`);
    }

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-sm space-x-2">
            <Input type="text" placeholder="Search..." value={searchData.query} onChange={(e) => { setSearchData({...searchData, query: e.target.value}) }}/>
            <Button type="submit" className="cursor-pointer">Search</Button>
        </form>
    );
}

export default SearchBar;