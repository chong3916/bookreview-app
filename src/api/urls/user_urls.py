from django.urls import path
from api.views.user_views import UserProfileView, LoginUserView, CurrentUserView, CreateUserView, LogoutUserView

urlpatterns = [
    path('<int:pk>/', UserProfileView.as_view(), name='user-profile'),
    path('me/', CurrentUserView.as_view(), name='user-current'),
    path('new/', CreateUserView.as_view(), name='user-signup'),
    path('login/', LoginUserView.as_view(), name='user-login'),
    path('logout/', LogoutUserView.as_view(), name='user-logout'),
]
