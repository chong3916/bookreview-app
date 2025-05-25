GET_BOOK_DETAILS_BY_BOOK_ID = """
query GetBookDetails($bookId: Int!) {
    books_by_pk(id: $bookId) {
        id
        image { url }
        default_cover_edition_id
        pages
        rating
        ratings_count
        release_date
        release_year
        reviews_count
        description
        editions_count
        editions(limit: 15, order_by: {users_count: desc}) {
            id
            image { url }
        }
        featured_book_series {
            series {
                primary_books_count
                name
                id
                is_completed
                description
                books_count
                book_series_aggregate(
                    distinct_on: position
                    order_by: [{position: asc}, {book: {ratings_count: desc}}]
                    where: {position: {_is_null: false}}
                ) {
                    nodes {
                        book_id
                        position
                        book {
                            rating
                            title
                            image { url }
                        }
                    }
                }
            }
            series_id
            position
        }
        taggings_aggregate(limit: 10, distinct_on: tag_id) {
            nodes {
                tag { tag }
            }
        }
        title
        contributions {
            contribution
            author { id name }
        }
    }
}
"""

GET_BOOK_BASIC_BY_BOOK_ID = """
query GetBookDetails($bookId: Int!) {
    books_by_pk(id: $bookId) {
        id
        image {
            url
        }
        pages
        rating
        ratings_count
        release_year
        reviews_count
        taggings_aggregate(limit: 10, distinct_on: tag_id) {
            nodes {
                tag {
                    tag
                }
            }
        }
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

GET_BOOK_DETAILS_BY_EDITION_ID = """
query GetBookDetails($editionId: Int!) {
    books(where: {editions: {id: {_eq: $editionId}}}) {
        id
        image {
            url
        }
        default_cover_edition_id
        pages
        rating
        ratings_count
        release_date
        release_year
        reviews_count
        description
        editions_count
        editions(limit: 15, order_by: {users_count: desc}) {
            id
            image {
                url
            }
        }
        featured_book_series {
            series {
                primary_books_count
                name
                id
                is_completed
                description
                books_count
                book_series_aggregate(
                    distinct_on: position
                    order_by: [{position: asc}, {book: {ratings_count: desc}}]
                    where: {position: {_is_null: false}}
                ) {
                    nodes {
                        book_id
                        position
                        book {
                            rating
                            title
                            image {
                                url
                            }
                        }
                    }
                }
            }
            series_id
            position
        }
        taggings_aggregate(limit: 10, distinct_on: tag_id) {
            nodes {
                tag {
                    tag
                }
            }
        }
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

GET_TRENDING_BOOKS = """
query GetTrending($from: date!, $to: date!) {
    books_trending(from: $from, to: $to, limit: 10, offset: 0) {
        ids
    }
}
"""
