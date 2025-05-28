GET_SEARCH_BOOK = """
query MyQuery($query: String!, $page: Int!, $sort: String!, $query_type: String!) {
    search(query: $query, page: $page, sort: $sort, query_type: $query_type) {
        results
    }
}
"""
