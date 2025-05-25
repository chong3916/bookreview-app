import re
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date
from dateutil.relativedelta import relativedelta

from api.queries import *
from core.settings import API_KEY

def graphql_request(query: str, variables: dict) -> requests.Response:
    url = "https://api.hardcover.app/v1/graphql"
    headers = {
        "Content-Type": "application/json",
        "authorization": f"Bearer {API_KEY}",
    }
    return requests.post(url, headers=headers, json={"query": query, "variables": variables})

def fetch_book_search(query, page: int)  -> requests.Response:
    variables = {"query": query, "page": page, "sort": "users_count:desc"}
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
        page = request.query_params.get("page", 1)
        if not query or not query.strip():
            return Response({"error": "Missing query"}, status=400)

        try:
            page = int(page)
        except ValueError:
            return Response({"error": "startIndex must be an integer"}, status=400)

        response = fetch_book_search(query, page)

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

        data = response.json().get("data", {})
        book = data.get("books_by_pk") or {}

        # Fallback to fetching by edition_id if book is not found
        if not book:
            response = fetch_book_details_edition_id(book_id)
            if response.status_code != 200:
                return Response({"error": "GraphQL request failed", "details": response.text}, status=response.status_code)
            books = response.json().get("data", {}).get("books", [])
            book = books[0] if books else {}

        flatten_image(book)
        flatten_tags(book)
        flatten_contributions(book)

        # Flatten series
        series_books = []
        featured_series = book.get("featured_book_series", {}).get("series")
        if featured_series:
            nodes = (
                featured_series.get("book_series_aggregate", {})
                .get("nodes", [])
            )
            for node in nodes:
                series_book = node.get("book", {})
                series_books.append({
                    "book_id": node.get("book_id"),
                    "position": node.get("position"),
                    "title": series_book.get("title"),
                    "rating": series_book.get("rating"),
                    "image_url": series_book.get("image", {}).get("url") if series_book.get("image") else None
                })

            featured_series["series_books"] = series_books
            featured_series.pop("book_series_aggregate", None)

        # Flatten editions
        edition_books = []
        for node in book.get("editions", []):
            edition_books.append({
                "id": node.get("id"),
                "image_url": node.get("image", {}).get("url") if node.get("image") else None
            })
        book["editions"] = edition_books
        book.pop("editions", None)  # Replace with flattened list

        # Fetch and flatten this edition
        edition_id = book.get("default_cover_edition_id")
        this_edition_response = fetch_this_edition(edition_id) if edition_id else None

        this_edition = {}
        if this_edition_response and this_edition_response.status_code == 200:
            this_edition_data = this_edition_response.json()
            this_edition = this_edition_data.get("data", {}).get("editions_by_pk", {}) or {}

            publisher = this_edition.get("publisher", {})
            this_edition["publisher_name"] = publisher.get("name")
            this_edition["publisher_id"] = publisher.get("id")
            this_edition.pop("publisher", None)

            language_node = this_edition.get("language", {})
            this_edition["language"] = language_node.get("language")
            this_edition.pop("language", None)

        book["this_edition"] = this_edition

        return Response(book)

class BookEditionsView(APIView):
    def get(self, request, book_id):
        page = request.query_params.get("page", 1)
        try:
            page = int(page)
        except ValueError:
            return Response({"error": "startIndex must be an integer"}, status=400)

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
            return Response({"error": "startIndex must be an integer"}, status=400)

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
        print(len(ids))
        books = []
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

        print(len(books))
        return Response(books)

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
def flatten_image(book_data):
    book_data["image_url"] = book_data.get("image", {}).get("url")
    book_data.pop("image", None)

def flatten_tags(book_data):
    taggings = book_data.get("taggings_aggregate", {}).get("nodes", [])
    book_data["tags"] = [node.get("tag", {}).get("tag") for node in taggings if node.get("tag")]
    book_data.pop("taggings_aggregate", None)

def flatten_contributions(book_data):
    contributions = book_data.get("contributions", [])
    authors = [
        {
            "id": c["author"]["id"],
            "name": c["author"]["name"],
            "contribution": c.get("contribution")
        }
        for c in contributions if c.get("author")
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
            "book_id": edition["book_id"],
            "image_id": edition.get("image", {}).get("id"),
            "image_url": edition.get("image", {}).get("url"),
            "release_date": edition.get("release_date"),
            "title": edition.get("title"),
            "publisher_name": edition.get("publisher", {}).get("name"),
            "publisher_id": edition.get("publisher", {}).get("id"),
            "edition_information": edition.get("edition_information"),
            "pages": edition.get("pages", 0),
            "id": edition.get("id"),
            "language": edition.get("language", {}).get("language"),
            "contributors": contributors,
            "edition_format": edition.get("edition_format"),
            "editions_count": edition.get("book", {}).get("editions_count")
        })
    return flattened

