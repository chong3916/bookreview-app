from rest_framework import serializers

from book_list.models import BookList


class BookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookList
        fields = ['id', 'name', 'description', 'isPublic', 'book_ids']
        read_only_fields = ['id']
