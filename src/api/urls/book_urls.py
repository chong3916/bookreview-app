from django.urls import path

from api.views.book_views import BookDetailView, BookHardcoverSearchView, TrendingView

urlpatterns = [
    path('search', BookHardcoverSearchView.as_view(), name='book-term-search'),
    path('<str:book_id>', BookDetailView.as_view(), name='book-detail'),
    path('trending/<str:duration>', TrendingView.as_view(), name='books-trending')
]
