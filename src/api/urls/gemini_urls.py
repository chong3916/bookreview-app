from django.urls import path

from api.views.gemini_views import RecommendationView

urlpatterns = [
    path('recommendation', RecommendationView.as_view(), name='ai-recommendation'),
]
