const searchBook = async (query: string, title: string, author: string, subject: string, page: number) => {
    const startIndex = Math.max((page - 1) * 10, 0);
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (title) params.append("title", title);
    if (author) params.append("author", author);
    if (subject) params.append("subject", subject);
    params.append("startIndex", startIndex.toString());

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

export const bookService = {
    searchBook,
    getBook,
    getEditions,
    getTrending,
    getUpcoming
}