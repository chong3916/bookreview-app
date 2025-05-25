GET_THIS_EDITION = """
query GetThisEdition($editionId: Int!) {
    editions_by_pk(id: $editionId) {
        id
        edition_information
        publisher {
            name
            id
        }
        isbn_10
        isbn_13
        asin
        language {
            language
        }
    }
}
"""

GET_BOOK_EDITIONS = """
query GetBookEditions($bookId: Int!, $offset: Int!) {
    editions(order_by: {users_count: desc}, where: {book_id: {_eq: $bookId}}, limit: 10, offset: $offset) {
        book_id
        image {
            id
            url
        }
        release_date
        title
        publisher {
            name
            id
        }
        edition_information
        edition_format
        pages
        id
        language {
            language
        }
        contributions {
            author {
                name
                id
            }
            contribution
        }
        book {
            editions_count
        }
    }
}
"""
