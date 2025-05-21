from django.urls import path
from api.views.user_views import UserProfileView
from api.views.user_views import CurrentUserView
from api.views.user_views import UserCreateView

urlpatterns = [
    path('<int:pk>/', UserProfileView.as_view(), name='user-profile'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('new/', UserCreateView.as_view(), name='user-signup'),
]
