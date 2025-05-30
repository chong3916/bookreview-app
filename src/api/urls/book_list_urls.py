from django.urls import path

from api.views.book_list_views import BookListCreateView, AddBookToListView, BookListDetailView

urlpatterns = [
    path('create/', BookListCreateView.as_view(), name='booklist-create'),
    path('<int:list_id>/', BookListDetailView.as_view(), name='booklist-detail'),
    path('<int:list_id>/add_book/', AddBookToListView.as_view(), name='booklist-add-book'),
]
