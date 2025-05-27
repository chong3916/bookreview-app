from django.urls import path

from api.views.tag_views import AllGenresView, AllMoodsView, AllTagsView

urlpatterns = [
    path('genres', AllGenresView.as_view(), name='all-genres'),
    path('moods', AllMoodsView.as_view(), name='all-moods'),
    path('tags', AllTagsView.as_view(), name='all-tags'),
]
