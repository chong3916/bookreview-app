import re
import requests
from django.templatetags.i18n import language
from rest_framework.response import Response
from rest_framework.views import APIView
from concurrent.futures import ThreadPoolExecutor

from core.settings import API_KEY

def fetch_this_edition(edition_id):
    url = "https://api.hardcover.app/v1/graphql"
    headers = {
        "Content-Type": "application/json",
        "authorization": f"Bearer {API_KEY}",
    }

    graphql_query = """
    query GetThisEdition($editionId: Int!) {
        editions_by_pk(id: $editionId) {
            id
            edition_information
            publisher {
                name
                id
            }
            isbn_10
            isbn_13
            asin
            language {
                language
            }
        }
    }
    """
    variables = {"editionId": edition_id}
    response = requests.post(url, headers=headers, json={"query": graphql_query, "variables": variables})
    return response



def fetch_book_details_book_id(book_id):
    url = "https://api.hardcover.app/v1/graphql"
    headers = {
        "Content-Type": "application/json",
        "authorization": f"Bearer {API_KEY}",
    }

    graphql_query = """
    query GetBookDetails($bookId: Int!) {
        books_by_pk(id: $bookId) {
            id
            image {
                url
            }
            default_cover_edition_id
            pages
            rating
            ratings_count
            release_date
            release_year
            reviews_count
            description
            editions_count
            editions(limit: 15, order_by: {users_count: desc}) {
                id
                image {
                    url
                }
            }
            featured_book_series {
                series {
                    primary_books_count
                    name
                    id
                    is_completed
                    description
                    books_count
                    book_series_aggregate(
                        distinct_on: position
                        order_by: [{position: asc}, {book: {ratings_count: desc}}]
                        where: {position: {_is_null: false}}
                    ) {
                        nodes {
                            book_id
                            position
                            book {
                                rating
                                title
                                image {
                                    url
                                }
                            }
                        }
                    }
                }
                series_id
                position
            }
            taggings_aggregate(limit: 10, distinct_on: tag_id) {
                nodes {
                    tag {
                        tag
                    }
                }
            }
            title
            contributions {
                contribution
                author {
                    id
                    name
                }
            }
        }
    }
    """

    variables = {"bookId": book_id}
    response = requests.post(url, headers=headers, json={"query": graphql_query, "variables": variables})
    return response

def fetch_book_details_edition_id(edition_id):
    url = "https://api.hardcover.app/v1/graphql"
    headers = {
        "Content-Type": "application/json",
        "authorization": f"Bearer {API_KEY}",
    }

    graphql_query = """
    query GetBookDetails($editionId: Int!) {
        books(where: {editions: {id: {_eq: $editionId}}}) {
            id
            image {
                url
            }
            default_cover_edition_id
            pages
            rating
            ratings_count
            release_date
            release_year
            reviews_count
            description
            editions_count
            editions(limit: 15, order_by: {users_count: desc}) {
                id
                image {
                    url
                }
            }
            featured_book_series {
                series {
                    primary_books_count
                    name
                    id
                    is_completed
                    description
                    books_count
                    book_series_aggregate(
                        distinct_on: position
                        order_by: [{position: asc}, {book: {ratings_count: desc}}]
                        where: {position: {_is_null: false}}
                    ) {
                        nodes {
                            book_id
                            position
                            book {
                                rating
                                title
                                image {
                                    url
                                }
                            }
                        }
                    }
                }
                series_id
                position
            }
            taggings_aggregate(limit: 10, distinct_on: tag_id) {
                nodes {
                    tag {
                        tag
                    }
                }
            }
            title
            contributions {
                contribution
                author {
                    id
                    name
                }
            }
        }
    }
    """

    variables = {"editionId": edition_id}
    response = requests.post(url, headers=headers, json={"query": graphql_query, "variables": variables})
    return response


class BookTermSearchView(APIView):
    def get(self, request):
        query = request.query_params.get("q")
        start_index = request.query_params.get("startIndex", 0)
        if not query or not query.strip():
            return Response({"error": "Missing query"}, status=400)

        try:
            start_index = int(start_index)
        except ValueError:
            return Response({"error": "startIndex must be an integer"}, status=400)

        query = re.sub(r'\s+', '+', query.strip())

        search_fields = "key,cover_i,title,edition_count,number_of_pages_median,subject,ratings_average,ratings_count,readinglog_count,want_to_read_count,currently_reading_count,already_read_count,author_name,cover_edition_key,first_publish_year"

        try:
            search_response = requests.get(
                "https://openlibrary.org/search.json", params={"q": query, "offset": start_index, "fields": search_fields, "limit": 10}, timeout=10)
            search_data = search_response.json()
            search_results = search_data.get("docs", [])

            return Response({
                "results": search_results,
                "total": search_data.get("numFound", 0),
            })
        except requests.RequestException as e:
            return Response({"error": "Failed to fetch data from Open Library", "details": str(e)}, status=502)

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

        url = "https://api.hardcover.app/v1/graphql"
        headers = {
            "Content-Type": "application/json",
            "authorization": f"Bearer {API_KEY}",
        }
        graphql_query = """
        query MyQuery($query: String!, $page: Int!, $sort: String!) {
          search(query: $query, page: $page, sort: $sort) {
            results
          }
        }
        """

        variables = {
            "query": query,
            "page": page,
            "sort": "users_count:desc"
        }

        response = requests.post(url, json={"query": graphql_query, "variables": variables}, headers=headers)

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
            return Response(
                {"error": "GraphQL request failed", "details": response.text},
                status=response.status_code
            )

        response_data = response.json()
        data = response_data.get("data", {})
        book = data.get("books_by_pk") or {}

        # Fallback to fetching by edition_id if book is not found
        if not book:
            response = fetch_book_details_edition_id(book_id)
            if response.status_code != 200:
                return Response(
                    {"error": "GraphQL request failed", "details": response.text},
                    status=response.status_code
                )
            response_data = response.json()
            data = response_data.get("data", {})
            books = data.get("books", [])
            book = books[0] if books else {}

        # Flatten image
        book["image_url"] = book.get("image", {}).get("url")
        book.pop("image", None)

        # Flatten tags
        taggings = book.get("taggings_aggregate", {}).get("nodes", [])
        flattened_tags = [node.get("tag", {}).get("tag") for node in taggings if node.get("tag")]
        book["tags"] = flattened_tags
        book.pop("taggings_aggregate", None)

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
        page_number = self.request.GET.get("page", 1)
        offset = int(page_number - 1) * 10

        url = "https://api.hardcover.app/v1/graphql"
        headers = {
            "Content-Type": "application/json",
            "authorization": f"Bearer {API_KEY}"
        }
        graphql_query = """
        query GetBookEditions($bookId: Int!, $offset: Int!) {
            editions(order_by: {users_count: desc}, where: {book_id: {_eq: $bookId}}, limit: 10, offset: $offset) {
                book_id
                image {
                    id
                    url
                }
                release_date
                title
                publisher {
                    name
                    id
                }
                edition_information
                edition_format
                pages
                id
                language {
                    language
                }
                contributions {
                    author {
                        name
                        id
                    }
                    contribution
                }
                book {
                    editions_count
                }
            }
        }
        """
        variables = {"bookId": book_id, "offset": offset}

        response = requests.post(
            url,
            headers=headers,
            json={"query": graphql_query, "variables": variables}
        )

        if response.status_code == 200:
            responseData = response.json()
            data = responseData.get("data", {})
            editions = data.get("editions", [])
            flattened_editions = []
            for edition in editions:
                contributors = [
                    {
                        "id": c["author"]["id"],
                        "name": c["author"]["name"],
                        "contribution": c["contribution"]
                    }
                    for c in edition.get("contributions", [])
                ]

                flattened_editions.append({"book_id": edition["book_id"],
                                           "image_id": edition["image"]["id"] if edition.get("image") else None,
                                           "image_url": edition["image"]["url"] if edition.get("image") else None,
                                           "release_date": edition["release_date"],
                                           "title": edition["title"],
                                           "publisher_name": edition["publisher"]["name"] if edition.get("publisher") else None,
                                           "publisher_id": edition["publisher"]["id"] if edition.get("publisher") else None,
                                           "edition_information": edition.get("edition_information", None),
                                           "pages": edition.get("pages", 0),
                                           "id": edition["id"],
                                           "language": edition["language"]["language"] if edition.get("language") and edition["language"].get("language") else None,
                                           "contributors": contributors,
                                           "edition_format": edition["edition_format"],
                                           "editions_count": edition["book"]["editions_count"]
                                           })

            return Response(flattened_editions)

        else:
            return Response(
                {"error": "GraphQL request failed", "details": response.text},
                status=response.status_code
            )
