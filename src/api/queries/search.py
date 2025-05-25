GET_SEARCH_BOOK = """
query MyQuery($query: String!, $page: Int!, $sort: String!) {
    search(query: $query, page: $page, sort: $sort) {
        results
    }
}
"""
