const getSearch = async (query: string, page: number, type: string) => {
    const paramPage = Math.max(page, 1);
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (type) params.append("type", type);
    params.append("page", paramPage.toString());

    const url = `/api/books/search?${params.toString()}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json();
    } catch (e) {
        console.error("Error during search fetch:", e);
        throw e;
    }
}

const getBook = async (bookId: string) => {
    try {
        const response = await fetch(`/api/books/${bookId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        console.log(response)
        return response.json();
    } catch (e) {
        console.error("Error getting book details:", e)
    }
}

const getEditions = async (editionId: string, page: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    try {
        const response = await fetch(`/api/editions/${editionId}?${params.toString()}`);

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        console.log(response)
        return response.json();
    } catch (e) {
        console.error("Error getting book editions:", e)
    }
}

const getTrending = async (duration: string, page: number)=> {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    try {
        const response = await fetch(`/api/books/trending/${duration}?${params.toString()}`);
        console.log(response);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json();
    } catch (e) {
        console.error("Error getting trending books:", e)
    }
}

const getUpcoming = async (duration: string, page: number)=> {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    try {
        const response = await fetch(`/api/books/upcoming/${duration}?${params.toString()}`);
        console.log(response);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json();
    } catch (e) {
        console.error("Error getting upcoming books:", e)
    }
}

const getSeries = async (seriesId: string) => {
    try {
        const response = await fetch(`/api/series/${seriesId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        console.log(response)
        return response.json();
    } catch (e) {
        console.error("Error getting series details:", e)
    }
}

const getAllGenres = async (page: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    try {
        const response = await fetch(`/api/tagging/genres?${params.toString()}`);
        console.log(response);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json();
    } catch (e) {
        console.error("Error getting all genres:", e)
    }
}

const getAllMoods = async (page: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    try {
        const response = await fetch(`/api/tagging/moods?${params.toString()}`);
        console.log(response);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json();
    } catch (e) {
        console.error("Error getting all genres:", e)
    }
}

const getAllTags = async (page: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    try {
        const response = await fetch(`/api/tagging/tags?${params.toString()}`);
        console.log(response);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json();
    } catch (e) {
        console.error("Error getting all genres:", e)
    }
}

export const bookService = {
    getSearch,
    getBook,
    getEditions,
    getTrending,
    getUpcoming,
    getSeries,
    getAllGenres,
    getAllMoods,
    getAllTags
}