"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from api.views.user_views import ActivateUserView, RefreshTokenView

urlpatterns = [
    path('', include('users.urls')),
    path('api/users/', include('api.urls.user_urls')),
    path('activate/<uidb64>/<token>/', ActivateUserView.as_view(), name='activate-user'),
    path('api/token/refresh/', RefreshTokenView.as_view(), name='refresh_token'),
    path('admin/', admin.site.urls),
    path('api/books/', include('api.urls.book_urls')),
    path('api/editions/', include('api.urls.edition_urls')),
]
