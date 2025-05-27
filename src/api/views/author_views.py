import requests
from rest_framework.response import Response
from rest_framework.views import APIView

from api.queries import *
from api.views.book_views import flatten_image, graphql_request, safe_get


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
        author = safe_get(data, "authors_by_pk", default={})
        flatten_image(author)

        # Get books of author and flatten image
        books = safe_get(data, "books", default=[])
        for book in books:
            flatten_image(book)
        author["books"] = books

        # Get book aggregate and flatten
        books_aggregate = safe_get(data, "books_aggregate", default={})
        aggregate = safe_get(books_aggregate, "aggregate", default={})
        avg_rating = safe_get(aggregate, "avg", "rating")
        ratings_count_sum = safe_get(aggregate, "sum", "ratings_count", default=0)
        reviews_count_sum = safe_get(aggregate, "sum", "reviews_count", default=0)
        users_count_sum = safe_get(aggregate, "sum", "users_count", default=0)

        author["avg_rating"] = avg_rating
        author["ratings_count"] = ratings_count_sum
        author["reviews_count"] = reviews_count_sum
        author["users_count"] = users_count_sum

        return Response(author)