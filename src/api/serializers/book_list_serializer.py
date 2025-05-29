from rest_framework import serializers

from api.queries import GET_LIST_PREVIEW_BOOK
from api.views.book_views import flatten_book_response, graphql_request
from book_list.models import BookList
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

def fetch_list_preview_books(book_id):
    variables = {"bookId": book_id}
    return graphql_request(GET_LIST_PREVIEW_BOOK, variables)

class BookListSerializer(serializers.ModelSerializer):
    preview_books = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        fields = ['id', 'name', 'description', 'isPublic', 'book_ids', 'preview_books']
        read_only_fields = ['id']

    def get_preview_books(self, obj):
        include_preview = self.context.get('include_preview_books', False)
        if not include_preview:
            return None

        preview_ids = obj.book_ids[:5]
        results = []

        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_id = {executor.submit(self.get_book_data, book_id): book_id for book_id in preview_ids}
            for future in as_completed(future_to_id):
                try:
                    data = future.result()
                    if data:
                        results.append(data)
                except Exception as e:
                    results.append({"error": str(e)})

        return results

    def get_book_data(self, external_id):
        response = fetch_list_preview_books(external_id)
        if response.status_code == 200:
            data = response.json().get("data", {})
            book = data.get("books_by_pk")
            if book:
                flat = flatten_book_response(book)
                return flat

        return {"error": "GraphQL request failed", "details": response.text}

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not self.context.get('include_preview_books', False):
            rep.pop('preview_books', None)  # cleanly remove field
        return rep

class AddBookToListSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
