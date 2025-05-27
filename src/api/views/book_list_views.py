from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from api.serializers.book_list_serializer import BookListSerializer
from book_list.models import BookList


class BookListCreateView(CreateAPIView):
    queryset = BookList.objects.all()
    serializer_class = BookListSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
