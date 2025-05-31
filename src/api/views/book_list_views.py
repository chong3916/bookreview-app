from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from api.serializers.book_list_serializer import BookListSerializer, AddBookToListSerializer, EditBookListSerializer, \
    RemoveBookFromListSerializer
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

class RemoveBookFromListView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, list_id):
        serializer = RemoveBookFromListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        book_id = serializer.validated_data['book_id']

        book_list = get_object_or_404(BookList, id=list_id, user=request.user)

        if book_id not in book_list.book_ids:
            return Response({"detail": "Book not in list."}, status=status.HTTP_400_BAD_REQUEST)

        # Remove book_id from the array field
        book_list.book_ids.remove(book_id)
        book_list.save()

        return Response({"detail": "Book removed from list."}, status=status.HTTP_200_OK)


class BookListDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, list_id):
        book_list = get_object_or_404(BookList, id=list_id)

        user = request.user
        if not (book_list.user == user or book_list.isPublic or user in book_list.visible_to.all()):
            return Response({'detail': 'Not authorized to view this list.'}, status=status.HTTP_403_FORBIDDEN)

        page = int(request.query_params.get('page', 1))  # only page comes from query param
        page_size = 20  # fixed page size

        context = {
            'request': request,
            'include_book_details': True,
            'page': page,
            'page_size': page_size,
        }

        serializer = BookListSerializer(book_list, context=context)
        return Response(serializer.data)

class EditBookListView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, list_id):
        book_list = get_object_or_404(BookList, id=list_id, user=request.user)

        serializer = EditBookListSerializer(book_list, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"detail": "Book list updated successfully."}, status=status.HTTP_200_OK)
