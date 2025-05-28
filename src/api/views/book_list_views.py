from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from api.serializers.book_list_serializer import BookListSerializer, AddBookToListSerializer
from book_list.models import BookList
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status

class BookListCreateView(CreateAPIView):
    queryset = BookList.objects.all()
    serializer_class = BookListSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddBookToListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, list_id):
        # Validate input
        serializer = AddBookToListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        book_id = serializer.validated_data['book_id']

        # Get BookList owned by user
        book_list = get_object_or_404(BookList, id=list_id, user=request.user)

        if book_id in book_list.book_ids:
            return Response({"detail": "Book already in list."}, status=status.HTTP_400_BAD_REQUEST)

        # Add the book_id to the list and save
        book_list.book_ids.append(book_id)
        book_list.save()

        return Response({"detail": "Book added to list."}, status=status.HTTP_200_OK)
