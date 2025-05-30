interface createListInput {
    name: string,
    description: string,
    isPublic: boolean,
    book_ids: number[]
}

interface addBookInput {
    book_id: number
}

const createList = async (accessToken: string | null, name: string, description: string, isPublic: boolean, bookIds: number[]) => {
    if (!accessToken) return

    const payload: createListInput = {
        name: name,
        description: description,
        isPublic: isPublic,
        book_ids: bookIds ? bookIds : []
    };

    const response = await fetch('/api/booklist/create/', {
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

const getCurrentUserLists = async (accessToken: string | null)=> {
    if (!accessToken) return

    const response = await fetch('/api/users/profile/booklists/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`, // ⬅️ important
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error('Failed to get profiles book lists');
    }

    return await response.json();
}

const addBookToList = async (accessToken: string | null, listId: number, bookId: number) => {
    if (!accessToken) return
    console.log(bookId)
    const payload: addBookInput = {
        book_id: bookId
    };

    const response = await fetch(`/api/booklist/${listId}/add_book/`, {
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

const getBookList = async (accessToken: string | null, listId: string | undefined) => {
    if (!accessToken || !listId) throw new Error('Failed to get list')

    const response = await fetch(`/api/booklist/${listId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`, // ⬅️ important
            'Content-Type': 'application/json'
        },
    })

    if (!response.ok) {
        throw new Error('Not authorized to view list');
    }

    return await response.json();
}

export const bookListService = {
    createList,
    getCurrentUserLists,
    addBookToList,
    getBookList
}
