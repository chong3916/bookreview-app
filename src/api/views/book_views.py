import re
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date
from dateutil.relativedelta import relativedelta

from api.queries import *
from core.settings import API_KEY

SEARCH_QUERY_TYPES = ["author", "book", "character", "list", "prompt", "publisher", "series", "user"]

def graphql_request(query: str, variables: dict) -> requests.Response:
    url = "https://api.hardcover.app/v1/graphql"
    headers = {
        "Content-Type": "application/json",
        "authorization": f"Bearer {API_KEY}",
    }
    return requests.post(url, headers=headers, json={"query": query, "variables": variables})

def fetch_search(query, page: int, query_type)  -> requests.Response:
    sort = ""
    if query_type == "book":
        sort = "users_count:desc"
    variables = {"query": query, "page": page, "sort": sort, "query_type": query_type}
    return graphql_request(GET_SEARCH_BOOK, variables)

def fetch_book_basic(book_id: int) -> requests.Response:
    variables = {"bookId": book_id}
    return graphql_request(GET_BOOK_BASIC_BY_BOOK_ID, variables)

def fetch_this_edition(edition_id: int) -> requests.Response:
    variables = {"editionId": edition_id}
    return graphql_request(GET_THIS_EDITION, variables)

def fetch_book_details_book_id(book_id: int) -> requests.Response:
    variables = {"bookId": book_id}
    return graphql_request(GET_BOOK_DETAILS_BY_BOOK_ID, variables)

def fetch_book_details_edition_id(edition_id: int) -> requests.Response:
    variables = {"editionId": edition_id}
    return graphql_request(GET_BOOK_DETAILS_BY_EDITION_ID, variables)

def fetch_book_editions(book_id: int, offset: int) -> requests.Response:
    variables = {"bookId": book_id, "offset": offset}
    return graphql_request(GET_BOOK_EDITIONS, variables)

def fetch_trending_books(from_str, to_str, offset: int) -> requests.Response:
    variables = {"from": from_str, "to": to_str, "offset": offset}
    return graphql_request(GET_TRENDING_BOOKS, variables)

def fetch_upcoming_books(from_str, to_str, offset: int) -> requests.Response:
    variables = {"from": from_str, "to": to_str, "offset": offset}
    return graphql_request(GET_UPCOMING_BOOKS, variables)

def fetch_book_series(series_id: int) -> requests.Response:
    variables = {"seriesId": series_id}
    return graphql_request(GET_SERIES_BY_ID, variables)

# class BookTermSearchView(APIView):
#     def get(self, request):
#         query = request.query_params.get("q")
#         start_index = request.query_params.get("startIndex", 0)
#         if not query or not query.strip():
#             return Response({"error": "Missing query"}, status=400)
#
#         try:
#             start_index = int(start_index)
#         except ValueError:
#             return Response({"error": "startIndex must be an integer"}, status=400)
#
#         query = re.sub(r'\s+', '+', query.strip())
#
#         search_fields = "key,cover_i,title,edition_count,number_of_pages_median,subject,ratings_average,ratings_count,readinglog_count,want_to_read_count,currently_reading_count,already_read_count,author_name,cover_edition_key,first_publish_year"
#
#         try:
#             search_response = requests.get(
#                 "https://openlibrary.org/search.json", params={"q": query, "offset": start_index, "fields": search_fields, "limit": 10}, timeout=10)
#             search_data = search_response.json()
#             search_results = search_data.get("docs", [])
#
#             return Response({
#                 "results": search_results,
#                 "total": search_data.get("numFound", 0),
#             })
#         except requests.RequestException as e:
#             return Response({"error": "Failed to fetch data from Open Library", "details": str(e)}, status=502)

class BookHardcoverSearchView(APIView):
    def get(self, request):
        query = request.query_params.get("q")
        query_type = request.query_params.get("type", "book").lower()
        page = request.query_params.get("page", 1)
        if not query or not query.strip():
            return Response({"error": "Missing query"}, status=400)

        try:
            page = int(page)
        except ValueError:
            return Response({"error": "startIndex must be an integer"}, status=400)

        if query_type not in SEARCH_QUERY_TYPES:
            query_type = "book"

        print(query_type)
        response = fetch_search(query, page, query_type)

        if response.status_code == 200:
            responseData = response.json()
            data = responseData.get("data", {})
            search = data.get("search", {})
            results = search.get("results", {})
            return Response(results)
        else:
            return Response(
                {"error": "GraphQL request failed", "status_code": response.status_code, "details": response.text},
                status=response.status_code,
            )


class BookDetailView(APIView):
    def get(self, request, book_id):
        response = fetch_book_details_book_id(book_id)
        if response.status_code != 200:
            return Response({"error": "GraphQL request failed", "details": response.text}, status=response.status_code)

        data = safe_get(response.json(), "data", default={})
        book = safe_get(data, "books_by_pk", default={})

        if not book:
            response = fetch_book_details_edition_id(book_id)
            if response.status_code != 200:
                return Response({"error": "GraphQL request failed", "details": response.text}, status=response.status_code)
            books = safe_get(response.json(), "data", "books", default=[])
            book = books[0] if books else {}

        flatten_image(book)
        flatten_tags(book)
        flatten_contributions(book)

        series_books = []
        featured_series = safe_get(book, "featured_book_series", "series", default={})
        if featured_series:
            nodes = safe_get(featured_series, "book_series_aggregate", "nodes", default=[])
            for node in nodes:
                series_book = safe_get(node, "book", default={})
                series_books.append({
                    "book_id": node.get("book_id"),
                    "position": node.get("position"),
                    "title": series_book.get("title"),
                    "rating": series_book.get("rating"),
                    "image_url": safe_get(series_book, "image", "url")
                })

            featured_series["series_books"] = series_books
            featured_series.pop("book_series_aggregate", None)

        edition_books = []
        for node in book.get("editions", []):
            edition_books.append({
                "id": node.get("id"),
                "image_url": safe_get(node, "image", "url")
            })
        book["editions"] = edition_books
        book.pop("editions", None)

        edition_id = book.get("default_cover_edition_id")
        this_edition_response = fetch_this_edition(edition_id) if edition_id else None

        this_edition = {}
        if this_edition_response and this_edition_response.status_code == 200:
            this_edition_data = this_edition_response.json()
            this_edition = safe_get(this_edition_data, "data", "editions_by_pk", default={})

            this_edition["publisher_name"] = safe_get(this_edition, "publisher", "name")
            this_edition["publisher_id"] = safe_get(this_edition, "publisher", "id")
            this_edition.pop("publisher", None)

            this_edition["language"] = safe_get(this_edition, "language", "language")
            this_edition.pop("language", None)

        book["this_edition"] = this_edition

        return Response(book)

class BookEditionsView(APIView):
    def get(self, request, book_id):
        page = request.query_params.get("page", 1)
        try:
            page = int(page)
        except ValueError:
            return Response({"error": "page must be an integer"}, status=400)

        offset = max(page - 1, 0) * 10
        response = fetch_book_editions(book_id, offset)

        if response.status_code != 200:
            return Response(
                {"error": "GraphQL request failed", "details": response.text},
                status=response.status_code
            )

        responseData = response.json()
        data = responseData.get("data", {})
        editions = data.get("editions", [])
        flattened_editions = flatten_editions(editions)

        return Response(flattened_editions)

class TrendingView(APIView):
    def get(self, request, duration):
        today = date.today()
        durations = {
            "month": relativedelta(months=1),
            "recent": relativedelta(months=3),
            "year": relativedelta(years=1)
        }

        if duration not in durations:
            return Response({"error": "Invalid duration"}, status=400)

        page = request.query_params.get("page", 1)
        try:
            page = int(page)
        except ValueError:
            return Response({"error": "page must be an integer"}, status=400)

        offset = max(page - 1, 0) * 10

        from_date = today - durations[duration]
        to_str = today.strftime("%Y-%m-%d")
        from_str = from_date.strftime("%Y-%m-%d")

        response = fetch_trending_books(from_str, to_str, offset)

        if response.status_code != 200:
            return Response(
                {"error": "GraphQL request failed", "details": response.text},
                status=response.status_code
            )

        responseData = response.json()
        data = responseData.get("data", {})
        trending_books = data.get("books_trending", {})
        ids = trending_books.get("ids") or []
        books = []

        # Get trending book details
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = {executor.submit(fetch_book_basic, book_id): book_id for book_id in ids}

            for future in as_completed(futures):
                response = future.result()
                if response.status_code == 200:
                    data = response.json().get("data", {})
                    book = data.get("books_by_pk")
                    if book:
                        flat = flatten_book_response(book)
                        books.append(flat)
                else:
                    print(f"Failed to fetch book ID {futures[future]} - Status: {response.status_code}")

        return Response(books)

class UpcomingView(APIView):
    def get(self, request, duration):
        today = date.today()
        future_durations = {
            "month": relativedelta(months=1),
            "quarter": relativedelta(months=3),
            "year": relativedelta(years=1)
        }

        page = request.query_params.get("page", 1)
        try:
            page = int(page)
        except ValueError:
            return Response({"error": "startIndex must be an integer"}, status=400)

        offset = max(page - 1, 0) * 10

        if duration == "recent":
            # Past 1 month
            from_date = today - relativedelta(months=1)
            to_date = today
        elif duration in future_durations:
            # Future time ranges
            from_date = today
            to_date = today + future_durations[duration]
        else:
            return Response({"error": "Invalid duration"}, status=400)

        from_str = from_date.strftime("%Y-%m-%d")
        to_str = to_date.strftime("%Y-%m-%d")

        response = fetch_upcoming_books(from_str, to_str, offset)

        if response.status_code != 200:
            return Response(
                {"error": "GraphQL request failed", "details": response.text},
                status=response.status_code
            )

        responseData = response.json()
        data = responseData.get("data", {})
        books = data.get("books", [])

        for book in books:
            flatten_book_response(book)
            flatten_featured_series(book)

        return Response(books)

class BookSeriesView(APIView):
    def get(self, request, series_id):
        response = fetch_book_series(series_id)

        if response.status_code != 200:
            return Response(
                {"error": "GraphQL request failed", "details": response.text},
                status=response.status_code
            )

        responseData = response.json()
        data = safe_get(responseData, "data", default={})
        series = safe_get(data, "series_by_pk", default={})
        books = safe_get(series, "book_series", default=[])
        for book in books:
            book_data = book.get("book", {})
            book["image_url"] = safe_get(book_data, "image", "url")
            book["pages"] = book_data.get("pages")
            book["ratings_count"] = book_data.get("ratings_count", 0)
            book["rating"] = book_data.get("rating")
            book["users_count"] = book_data.get("users_count", 0)
            book["title"] = book_data.get("title")
            book["release_date"] = book_data.get("release_date")
            book["release_year"] = book_data.get("release_year")
            book["reviews_count"] = book_data.get("reviews_count", 0)
            flatten_contributions(book_data)
            book["authors"] = book_data.get("authors")
            book.pop("book", None)

        return Response(series)

def flatten_book_response(book_data):
    if not book_data:
        return {}

    # Flatten image
    flatten_image(book_data)

    # Flatten tags
    flatten_tags(book_data)

    # Flatten contributions
    flatten_contributions(book_data)

    return book_data

# Flatten functions
def flatten_featured_series(book_data):
    featured_series = safe_get(book_data, "featured_book_series", default={})
    if not featured_series:
        return
    series = safe_get(featured_series, "series", default={})
    featured_series["series_books_count"] = series.get("books_count")
    featured_series["series_primary_books_count"] = series.get("primary_books_count")
    featured_series["name"] = series.get("name")
    featured_series.pop("series", None)

def flatten_image(book_data):
    book_data["image_url"] = safe_get(book_data, "image", "url")
    book_data.pop("image", None)

def flatten_tags(book_data):
    taggings = []
    if book_data.get("taggings_aggregate"):
        taggings = safe_get(book_data, "taggings_aggregate", "nodes", default=[])
        book_data.pop("taggings_aggregate", None)
    else:
        taggings = book_data.pop("taggings", [])
    book_data["tags"] = [safe_get(node, "tag", "tag") for node in taggings if safe_get(node, "tag")]

def flatten_contributions(book_data):
    contributions = book_data.get("contributions", [])
    authors = [
        {
            "id": safe_get(c, "author", "id"),
            "name": safe_get(c, "author", "name"),
            "contribution": c.get("contribution")
        }
        for c in contributions if safe_get(c, "author")
    ]
    book_data["authors"] = authors
    book_data.pop("contributions", None)

def flatten_editions(editions_list):
    flattened = []
    for edition in editions_list:
        contributors = [
            {
                "id": c["author"]["id"],
                "name": c["author"]["name"],
                "contribution": c.get("contribution")
            }
            for c in edition.get("contributions", [])
        ]
        flattened.append({
            "book_id": edition.get("book_id"),
            "image_id": safe_get(edition, "image", "id"),
            "image_url": safe_get(edition, "image", "url"),
            "release_date": edition.get("release_date"),
            "title": edition.get("title"),
            "publisher_name": safe_get(edition, "publisher", "name"),
            "publisher_id": safe_get(edition, "publisher", "id"),
            "edition_information": edition.get("edition_information", ""),
            "pages": edition.get("pages", 0),
            "id": edition.get("id"),
            "language": safe_get(edition, "language", "language"),
            "contributors": contributors,
            "edition_format": edition.get("edition_format"),
            "editions_count": safe_get(edition, "book", "editions_count", default=1)
        })
    return flattened

def safe_get(d: dict, *keys, default=None):
    for key in keys:
        if isinstance(d, dict) and key in d:
            d = d[key]
        else:
            return default
    return d
