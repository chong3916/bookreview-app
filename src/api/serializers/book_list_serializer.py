from rest_framework import serializers

from api.queries import GET_LIST_PREVIEW_BOOK
from api.views.book_views import flatten_book_response, graphql_request, fetch_book_basic
from book_list.models import BookList
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

def fetch_list_preview_books(book_id):
    variables = {"bookId": book_id}
    return graphql_request(GET_LIST_PREVIEW_BOOK, variables)

class BookListSerializer(serializers.ModelSerializer):
    preview_books = serializers.SerializerMethodField()
    book_details = serializers.SerializerMethodField()
    owner_id = serializers.UUIDField(source="user.id", read_only=True)

    class Meta:
        model = BookList
        fields = ['id', 'name', 'description', 'isPublic', 'book_ids', 'preview_books', 'book_details', 'owner_id']
        read_only_fields = ['id']

    def get_book_details(self, obj):
        include_detail = self.context.get('include_book_details', False)
        if not include_detail:
            return None

        page = self.context.get('page', 1)
        page_size = self.context.get('page_size', 20)

        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 20

        offset = (page - 1) * page_size
        limit = offset + page_size

        detail_ids = obj.book_ids[offset:limit]
        results = []

        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_id = {executor.submit(self.get_book_data, book_id, False): book_id for book_id in detail_ids}
            for future in as_completed(future_to_id):
                try:
                    data = future.result()
                    if data:
                        results.append(data)
                except Exception as e:
                    results.append({"error": str(e)})

        return results

    def get_preview_books(self, obj):
        include_preview = self.context.get('include_preview_books', False)
        if not include_preview:
            return None

        preview_ids = obj.book_ids[:5]
        results = []

        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_id = {executor.submit(self.get_book_data, book_id, True): book_id for book_id in preview_ids}
            for future in as_completed(future_to_id):
                try:
                    data = future.result()
                    if data:
                        results.append(data)
                except Exception as e:
                    results.append({"error": str(e)})

        return results

    def get_book_data(self, external_id, isPreview):
        if isPreview:
            response = fetch_list_preview_books(external_id)
        else:
            response = fetch_book_basic(external_id)
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
            rep.pop('preview_books', None)
        if not self.context.get('include_book_details', False):
            rep.pop('book_details', None)
            rep.pop('book_ids', None)

        if self.context.get('include_book_details', False):
            # Add pagination metadata for book_details
            page = self.context.get('page', 1)
            page_size = self.context.get('page_size', 20)
            total_books = len(instance.book_ids)

            rep['book_detail_pagination'] = {
                'page': page,
                'page_size': page_size,
                'total': total_books,
                'total_pages': (total_books + page_size - 1) // page_size,
            }

        return rep

class AddBookToListSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
