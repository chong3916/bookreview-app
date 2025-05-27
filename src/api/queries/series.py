GET_SERIES_BY_ID = """
query GetSeries ($seriesId: Int!){
    series_by_pk(id: $seriesId) {
        name
        primary_books_count
        books_count
        book_series(distinct_on: position order_by: [{position: asc}, {book: {ratings_count: desc}}] where: {position: {_is_null: false}}){
            book_id
            position
            book {
                image {
                    url
                }
                pages
                ratings_count
                rating
                users_count
                title
                release_date
                release_year
                reviews_count
                contributions {
                    contribution
                    author {
                        name
                        id
                    }
                }
            }
        }
    }
}
"""