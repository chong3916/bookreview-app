from google import genai
from google.genai import types

from api.queries import GET_RECOMMENDATION_BOOK
from api.views.book_views import graphql_request
from core.settings import GEMINI_API_KEY
from rest_framework.views import APIView
import requests
from rest_framework.response import Response
from pydantic import BaseModel
from concurrent.futures import ThreadPoolExecutor, as_completed

client = genai.Client(api_key=GEMINI_API_KEY)


def fetch_recommendation(title, author, isbn):
    query = title + " " + author + " " + isbn
    variables = {"query": query}
    return graphql_request(GET_RECOMMENDATION_BOOK, variables)

class Recommendation(BaseModel):
    title: str
    author: str
    isbn: str

class RecommendationView(APIView):
    def get(self, request):
        book_name = request.query_params.get('q', '')

        prompt_text = (
            f"Give 5 book recommendations similar to '{book_name}', "
            "and include the book title, author, and isbn."
        )

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt_text,
            config=types.GenerateContentConfig(
                system_instruction="You are a book recommendation engine.",
                response_mime_type="application/json",
                response_schema=list[Recommendation],
            ),
        )

        parsed_data = response.parsed
        clean_data = [dict(book) for book in parsed_data]

        recommendation_books = []
        with ThreadPoolExecutor(max_workers=5) as executor:
            # Submit all fetch tasks to the executor
            futures = {
                executor.submit(fetch_recommendation,
                                book.get("title", ""),
                                book.get("author", ""),
                                book.get("isbn", "").replace('-', '')): book
                for book in clean_data
            }

            # Collect results as they complete
            for future in as_completed(futures):
                try:
                    response = future.result()
                    if response.status_code == 200:
                        data = response.json().get("data", {})
                        search = data.get("search", {})
                        results = search.get("results", {})
                        hits = results.get("hits", [])
                        if hits:
                            recommendation_books.append(hits[0].get("document", {}))
                    else:
                        print(f"Failed to fetch book ID {futures[future]} - Status: {response.status_code}")
                except Exception as e:
                    # Optionally handle exceptions here, e.g., log or append error info
                    print(f"Error fetching recommendation: {e}")

        # You can return either the raw API response or combine with your detailed recommendations
        return Response(recommendation_books)

