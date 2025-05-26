GET_AUTHOR_DETAILS = """
query GetAuthorDetails($authorId: Int!) {
    authors_by_pk(id: $authorId) {
        id
        name
        bio
        books_count
        born_date
        born_year
        death_year
        death_date
        image {
            url
        }
    }
    books(where: { contributions: { author_id: { _eq: $authorId }, contributable_type: {_eq: "Book"}, book: {release_year: {_is_null: false}}}, canonical_id: {_is_null: true}}
    order_by: {users_count: desc}) {
        id
        title
        image {
            url
        }
        pages
        release_year
        users_count
        users_read_count
        ratings_count
        editions_count
        rating
    }
    books_aggregate(where: {contributions: {author_id: {_eq: $authorId}, contributable_type: {_eq: "Book"}}, release_year: {_is_null: false}, canonical_id: {_is_null: true}}) {
        aggregate {
            avg {
                rating
            }
            sum {
                ratings_count
                reviews_count
                users_count
            }
        }
    }
}
"""

# """
# book_series(where: {book: {contributions: {author_id: {_eq: $authorId}}, canonical_id: {_is_null: true}}} distinct_on: series_id) {
#         series_id
#         featured
#         series {
#             name
#             primary_books_count
#             books_count
#             book_series(limit: 5 order_by: [{position: asc}, {book: {users_count: desc}}] distinct_on: position){
#                 id
#                 position
#                 book {
#                     title
#                 }
#             }
#         }
#     }
# """
