from django.urls import path

from api.views.book_views import BookTermSearchView, BookDetailView, BookHardcoverSearchView

urlpatterns = [
    path('search', BookHardcoverSearchView.as_view(), name='book-term-search'),
    path("<str:book_id>", BookDetailView.as_view(), name="book-detail")
]
