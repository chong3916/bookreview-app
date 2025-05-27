GET_RECOMMENDATION_BOOK = """
query GetRecommendationBook($query: String!){
    search(page: 1, per_page: 1, query: $query, fields: "title, author_names, isbns", weights: "5,4,3", sort: "users_count:desc,_text_match:desc"){
        results
    }
}
"""