GET_LIST_PREVIEW_BOOK = """
query GetListPreviewBook($bookId: Int!) {
    books_by_pk(id: $bookId) {
        id
        image {
            url
        }
        pages
        rating
        ratings_count
        release_year
        title
        contributions {
            contribution
            author {
                id
                name
            }
        }
    }
}
"""