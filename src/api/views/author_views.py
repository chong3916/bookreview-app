import requests
from rest_framework.response import Response
from rest_framework.views import APIView

from api.queries import *
from api.views.book_views import flatten_image, graphql_request

def fetch_author_details(author_id: int):
    variables = {"authorId": author_id}
    return graphql_request(GET_AUTHOR_DETAILS, variables)

class AuthorDetailView(APIView):
    def get(self, request, author_id):
        response = fetch_author_details(author_id)
        if response.status_code != 200:
            return Response({"error": "GraphQL request failed", "details": response.text}, status=response.status_code)

        data = response.json().get("data", {})
        # Get author and flatten image
        author = data.get("authors_by_pk") or {}
        flatten_image(author)

        # Get books of author and flatten image
        books = data.get("books", [])
        for book in books:
            flatten_image(book)
        author["books"] = books

        # Get book aggregate and flatten
        books_aggregate = data.get("books_aggregate", {})
        aggregate = books_aggregate.get("aggregate", {})
        avg_rating = aggregate.get("avg", {}).get("rating", None)
        ratings_count_sum = aggregate.get("sum", {}).get("ratings_count", 0)
        reviews_count_sum = aggregate.get("sum", {}).get("reviews_count", 0)
        users_count_sum = aggregate.get("sum", {}).get("users_count", 0)
        author["avg_rating"] = avg_rating
        author["ratings_count"] = ratings_count_sum
        author["reviews_count"] = reviews_count_sum
        author["users_count"] = users_count_sum
        return Response(author)
