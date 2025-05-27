GET_ALL_GENRES = """
query GetGenres ($offset: Int!){
    tags(order_by: {count: desc} limit: 25 offset: $offset where: {tag_category_id: {_eq: 1}}) {
        tag
        count
        id
    }
}
"""

GET_ALL_MOODS = """
query GetMoods ($offset: Int!){
    tags(order_by: {count: desc} limit: 25 offset: $offset where: {tag_category_id: {_eq: 4}}) {
        tag
        count
        id
    }
}
"""

GET_ALL_TAGS = """
query GetMoods ($offset: Int!){
    tags(order_by: {count: desc} limit: 25 offset: $offset where: {tag_category_id: {_eq: 2}}) {
        tag
        count
        id
    }
}
"""
