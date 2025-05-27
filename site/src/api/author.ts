const getDetails = async (authorId: string) => {
    try {
        const response = await fetch(`/api/author/${authorId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        console.log(response)
        return response.json();
    } catch(e) {
        console.error("Error getting author details:", e)
    }
}

export const authorService = {
    getDetails,
}
