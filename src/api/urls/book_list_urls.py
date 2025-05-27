from django.urls import path

from api.views.book_list_views import BookListCreateView

urlpatterns = [
    path('create/', BookListCreateView.as_view(), name='booklist-create'),
]
