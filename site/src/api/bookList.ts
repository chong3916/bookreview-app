interface createListInput {
    name: string,
    description: string,
    isPublic: boolean,
    book_ids: number[]
}

const createList = async (accessToken: string | null, name: string, description: string, isPublic: boolean, bookIds: number[]) => {
    if (!accessToken) return

    const payload: createListInput = {
        name: name,
        description: description,
        isPublic: isPublic,
        book_ids: bookIds ? bookIds : []
    };

    const response = await fetch('/api/booklist/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`, // ⬅️ important
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        throw new Error('Failed to create new book list');
    }

    return await response.json();
}

export const bookListService = {
    createList
}
