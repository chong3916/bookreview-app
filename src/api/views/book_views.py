import re
import requests
from django.templatetags.i18n import language
from rest_framework.response import Response
from rest_framework.views import APIView
from concurrent.futures import ThreadPoolExecutor

from core.settings import API_KEY

def fetch_work_details(work_key):
    try:
        resp = requests.get(f"https://openlibrary.org{work_key}.json", timeout=5)
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass
    return {}

def fetch_work_ratings(work_key):
    try:
        resp = requests.get(f"https://openlibrary.org{work_key}/ratings.json", timeout=5)
        if resp.status_code == 200:
            return resp.json().get("summary", {})
    except Exception:
        pass
    return {}

def fetch_work_bookshelves(work_key):
    try:
        resp = requests.get(f"https://openlibrary.org{work_key}/bookshelves.json", timeout=5)
        if resp.status_code == 200:
            return resp.json().get("counts", {})
    except Exception:
        pass
    return {}

def fetch_edition(edition_key):
    try:
        resp = requests.get(f"https://openlibrary.org/books/{edition_key}.json", timeout=5)
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass
    return {}

def fetch_author(author_key):
    try:
        resp = requests.get(f"https://openlibrary.org/{author_key}.json", timeout=5)
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass
    return {}

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

            # additional_info = []
            #
            # with ThreadPoolExecutor(max_workers=10) as executor:
            #     futures_details = {executor.submit(fetch_work_details, work.get("key")): work for work in works if work.get("key")}
            #     futures_ratings = {executor.submit(fetch_work_ratings, work.get("key")): work for work in works if work.get("key")}
            #
            #     details_results = {work.get("key"): f.result() for f, work in futures_details.items()}
            #     ratings_results = {work.get("key"): f.result() for f, work in futures_ratings.items()}
            #
            # for work in works:
            #     key = work.get("key")
            #     if not key:
            #         continue
            #
            #     # Fetch work details
            #     work_details = details_results.get(key, {})
            #     ratings_summary = ratings_results.get(key, {})
            #
            #     description_raw = work_details.get("description", "")
            #     if isinstance(description_raw, dict):
            #         description = description_raw.get("value", "")
            #     else:
            #         description = description_raw
            #
            #     editions = work.get("editions", {})
            #     relevant_editions = editions.get("docs", [])
            #
            #     additional_info.append({
            #         "title": work.get("title"),
            #         "author_name": work.get("author_name", []),
            #         "first_publish_year": work.get("first_publish_year"),
            #         "cover_i": work.get("cover_i"),
            #         "key": key,
            #         "description": description,
            #         "subjects": work_details.get("subjects", []),
            #         "ratings": ratings_summary,
            #         "editions": relevant_editions[0] if relevant_editions else None
            #     })


            return Response({
                "results": search_results,
                "total": search_data.get("numFound", 0),
            })
        except requests.RequestException as e:
            return Response({"error": "Failed to fetch data from Open Library", "details": str(e)}, status=502)

    # def get(self, request):
    #     query = request.query_params.get("q")
    #     start_index = request.query_params.get("startIndex", 0)
    #     if not query or not query.strip():
    #         return Response({"error": "Missing query"}, status=400)
    #
    #     try:
    #         start_index = int(start_index)
    #     except ValueError:
    #         return Response({"error": "startIndex must be an integer"}, status=400)
    #
    #     query = re.sub(r'\s+', '+', query.strip())
    #     response = requests.get("https://www.googleapis.com/books/v1/volumes", params={"q": query, "maxResults": 10, "startIndex": start_index})
    #     print("here")
    #     return Response(response.json())
#
# class BookDetailView(APIView):
#     def get(sef, request, book_id):
#         edition_details = fetch_edition(book_id)
#
#         work_key = edition_details.get("works", [])
#         first_work_key_pair = work_key[0] if work_key else ""
#         first_work_key = first_work_key_pair.get("key", "")
#
#         author_ref = edition_details.get("authors", [])
#         with ThreadPoolExecutor(max_workers=10) as executor:
#             futures_authors = {
#                 executor.submit(fetch_author, author_ref.get("key", "")): author_ref
#                 for author_ref in author_ref if author_ref.get("key")
#             }
#
#             # Fetch other work-related data concurrently
#             future_work_details = executor.submit(fetch_work_details, first_work_key)
#             future_ratings = executor.submit(fetch_work_ratings, first_work_key)
#             future_bookshelves = executor.submit(fetch_work_bookshelves, first_work_key)
#
#             # Collect author data
#             authors = []
#             for future in futures_authors:
#                 result = future.result()
#                 if result:
#                     authors.append(result)
#
#             # Collect other data
#             work_details = future_work_details.result()
#             ratings_details = future_ratings.result()
#             bookshelves_details = future_bookshelves.result()
#
#         description_raw = work_details.get("description", "")
#         if isinstance(description_raw, dict):
#             description = description_raw.get("value", "")
#         else:
#             description = description_raw
#
#         return Response({
#             "title": work_details.get("title"),
#             "key": book_id,
#             "description": description,
#             "ratings": ratings_details,
#             "covers": work_details.get("covers", []),
#             "subjects": work_details.get("subjects", []),
#             "edition_publish_date": edition_details.get("publish_date", ""),
#             "number_of_pages": edition_details.get("number_of_pages", ""),
#             "publishers": edition_details.get("publishers", []),
#             "authors": authors,
#             "counts": bookshelves_details
#         })

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
        url = "https://api.hardcover.app/v1/graphql"
        headers = {
            "Content-Type": "application/json",
            "authorization": f"Bearer {API_KEY}",
        }
        graphql_query = """
        query GetBookDetails($bookId: Int!) {
            books(where: {id: {_eq: $bookId}}) {
                id
                image {
                    url
                    ratio
                    width
                    height
                }
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
                this_edition:editions(limit: 10, where: {image_id: {_eq: 1334723}}) {
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

        response = requests.post(
            url,
            headers=headers,
            json={"query": graphql_query, "variables": variables}
        )

        if response.status_code == 200:
            responseData = response.json()
            data = responseData.get("data", {})
            books = data.get("books", [])
            book = books[0] if books else {}

            # Flatten the tags
            taggings = book.get("taggings_aggregate", {}).get("nodes", [])
            flattened_tags = [node["tag"]["tag"] for node in taggings]

            book["tags"] = flattened_tags  # Add flattened tags
            book.pop("taggings_aggregate", None)

            # Flatten series
            series_nodes = (
                book.get("featured_book_series", {})
                .get("series", {})
                .get("book_series_aggregate", {})
                .get("nodes", [])
            )

            series_books = []
            for node in series_nodes:
                series_book = node.get("book", {})
                series_books.append({
                    "book_id": node.get("book_id"),
                    "position": node.get("position"),
                    "title": series_book.get("title"),
                    "rating": series_book.get("rating"),
                    "image_url": series_book.get("image", {}).get("url") if series_book.get("image") else None
                })

            edition_books = []
            edition_nodes = book.get("editions", [])
            for node in edition_nodes:
                edition_books.append({
                    "id": node.get("id"),
                    "image_url": node.get("image", {}).get("url") if node.get("image") else None
                })

            this_edition_array = book.get("this_edition", [])
            this_edition = this_edition_array[0]
            publisher = this_edition.get("publisher", {})
            this_edition["publisher_name"] = publisher.get("name", None)
            this_edition["publisher_id"] = publisher.get("id", None)
            this_edition.pop("publisher", None)
            language_node = this_edition.get("language", {})
            language = language_node.get("language", None)
            this_edition.pop("language")
            this_edition["language"] = language

            book["featured_book_series"]["series"]["series_books"] = series_books
            book["featured_book_series"]["series"].pop("book_series_aggregate", None)

            book.pop("editions", None)
            book["editions"] = edition_books

            book.pop("this_edition", None)
            book["this_edition"] = this_edition

            return Response(book)
        else:
            return Response(
                {"error": "GraphQL request failed", "details": response.text},
                status=response.status_code
            )

class BookEditionsView(APIView):
    def get(self, request, book_id):
        url = "https://api.hardcover.app/v1/graphql"
        headers = {
            "Content-Type": "application/json",
            "authorization": f"Bearer {API_KEY}"
        }
        graphql_query = """
        query GetBookDetails($bookId: Int!) {
            editions(order_by: {users_count: desc}, where: {book_id: {_eq: 328491}}, limit: 10, offset: 0) {
                book_id
                image {
                  id
                  url
                }
                release_date
                book {
                  editions_count
                }
                title
                publisher {
                  name
                  id
                }
                edition_information
                pages
            }
        }
        """
        variables = {"bookId": book_id}

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
                flattened_editions.append({"book_id": edition["book_id"],
                                           "image_id": edition["image"]["id"],
                                           "image_url": edition["image"]["url"],
                                           "release_date": edition["release_date"],
                                           "editions_count": edition["book"]["editions_count"],
                                           "title": edition["title"],
                                           "publisher_name": edition["publisher"]["name"],
                                           "publisher_id": edition["publisher"]["id"],
                                           "edition_information": edition.get("edition_information", None)})

            return Response(flattened_editions)

        else:
            return Response(
                {"error": "GraphQL request failed", "details": response.text},
                status=response.status_code
            )


