import re
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from api.queries import *
from api.views.book_views import graphql_request, safe_get

from core.settings import API_KEY


def fetch_all_genres(offset: int) -> requests.Response:
    variables = {"offset": offset}
    return graphql_request(GET_ALL_GENRES, variables)

def fetch_all_moods(offset: int) -> requests.Response:
    variables = {"offset": offset}
    return graphql_request(GET_ALL_MOODS, variables)

def fetch_all_tags(offset: int) -> requests.Response:
    variables = {"offset": offset}
    return graphql_request(GET_ALL_TAGS, variables)


class AllGenresView(APIView):
    def get(self, request):
        page = request.query_params.get("page", 1)
        try:
            page = int(page)
        except ValueError:
            return Response({"error": "page must be an integer"}, status=400)

        offset = max(page - 1, 0) * 10

        response = fetch_all_genres(offset)
        responseData = response.json()
        data = safe_get(responseData, "data", default={})
        genres = safe_get(data, "tags", default=[])
        return Response(genres)

class AllMoodsView(APIView):
    def get(self, request):
        page = request.query_params.get("page", 1)
        try:
            page = int(page)
        except ValueError:
            return Response({"error": "page must be an integer"}, status=400)

        offset = max(page - 1, 0) * 10

        response = fetch_all_moods(offset)
        responseData = response.json()
        data = safe_get(responseData, "data", default={})
        genres = safe_get(data, "tags", default=[])
        return Response(genres)

class AllTagsView(APIView):
    def get(self, request):
        page = request.query_params.get("page", 1)
        try:
            page = int(page)
        except ValueError:
            return Response({"error": "page must be an integer"}, status=400)

        offset = max(page - 1, 0) * 10

        response = fetch_all_tags(offset)
        responseData = response.json()
        data = safe_get(responseData, "data", default={})
        genres = safe_get(data, "tags", default=[])
        return Response(genres)
