from django.urls import path

from api.views.book_views import BookEditionsView

urlpatterns = [
    path("<str:book_id>", BookEditionsView.as_view(), name="book-editions")
]