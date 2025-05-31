interface createListInput {
    name: string,
    description: string,
    isPublic: boolean,
    book_ids: number[]
}

interface addBookInput {
    book_id: number
}

interface editListInput {
    name: string,
    description: string,
    isPublic: boolean
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

    const response = await fetch('/api/users/booklists/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error('Failed to get profiles book lists');
    }

    return await response.json();
}

const getAllUsersLists = async (accessToken: string | null, userId: string, page: number)=> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }


    const response = await fetch(`/api/users/booklists/?user_id=${userId}&page=${page}`, {
        method: 'GET',
        headers,
    })

    if (!response.ok) {
        throw new Error('Failed to get book lists');
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
        throw new Error('Failed to add book to list');
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

const editList = async (accessToken: string | null, listId: number, name: string, description: string, isPublic: boolean) => {
    if (!accessToken || !listId) throw new Error('Failed to edit list')

    const payload: editListInput = {
        name: name,
        description: description,
        isPublic: isPublic
    };
    const response = await fetch(`/api/booklist/${listId}/edit/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`, // ⬅️ important
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        throw new Error('Not authorized to edit list');
    }

    return await response.json();
}

const removeBookFromList = async (accessToken: string | null, listId: number, bookId: number) => {
    if (!accessToken) return
    console.log(bookId)
    const payload: addBookInput = {
        book_id: bookId
    };

    const response = await fetch(`/api/booklist/${listId}/remove_book/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`, // ⬅️ important
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        throw new Error('Failed to remove book from list');
    }

    return await response.json();
}

export const bookListService = {
    createList,
    getCurrentUserLists,
    addBookToList,
    getBookList,
    editList,
    removeBookFromList,
    getAllUsersLists
}
