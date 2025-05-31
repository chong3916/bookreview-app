from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from rest_framework.parsers import MultiPartParser, FormParser

from api.serializers.book_list_serializer import BookListSerializer
from book_list.models import BookList
from core.settings import SUPABASE_URL, SUPABASE_BUCKET, SUPABASE_API_KEY
from users.models import CustomUser
from api.serializers.user_serializer import UserSerializer, CurrentUserSerializer, EditUserSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model, authenticate
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError
import requests
import uuid

from rest_framework.exceptions import NotFound
from django.db import models
from rest_framework.pagination import PageNumberPagination

class UserProfileView(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = CustomUser.objects.prefetch_related("lists").get(pk=request.user.pk)
        user_serializer = CurrentUserSerializer(user)
        book_lists = BookList.objects.filter(user=request.user)
        book_lists_serializer = BookListSerializer(book_lists, many=True, context={'include_preview_books': False, 'include_book_details': False})

        user_data = user_serializer.data
        user_data["book_lists"] = book_lists_serializer.data
        return Response(user_data)


class CreateUserView(CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

User = get_user_model()

class LoginUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Didn't give username or password
        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password) # Get user based on username and password

        if user is not None: # If user exists
            if not user.is_active: # Check user activated account
                return Response({'error': 'User account is not activated.'}, status=status.HTTP_403_FORBIDDEN)

            # Create jwt token and return it
            refresh = RefreshToken.for_user(user)
            response = Response({
                'access': str(refresh.access_token)
            })
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=60 * 60 * 24 * 7  # 7 days
            )

            return response
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ActivateUserView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Account activated!"})
        else:
            return Response({"error": "Invalid activation link"}, status=status.HTTP_400_BAD_REQUEST)

class LogoutUserView(APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass

        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('refresh_token')
        return response

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({'detail': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({'access': access_token})
        except TokenError as e:
            return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

# class CurrentUserBookListsView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def get(self, request):
#         book_lists = BookList.objects.filter(user=request.user)
#         serializer = BookListSerializer(book_lists, many=True, context={'include_preview_books': True, 'include_book_details': False})
#         return Response(serializer.data)

class UserBookListsPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'

class UserBookListsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        target_user_id = request.query_params.get("user_id")

        if target_user_id:
            try:
                target_user = CustomUser.objects.get(id=target_user_id)
            except CustomUser.DoesNotExist:
                raise NotFound("User not found.")

            if request.user.is_authenticated and request.user == target_user:
                # Owner requesting their own lists: no filter, show all
                book_lists = BookList.objects.filter(user=target_user).order_by('-created_at')
            else:
                # Others: only public or visible lists
                filters = models.Q(isPublic=True)
                if request.user.is_authenticated:
                    filters |= models.Q(visible_to=request.user)

                book_lists = BookList.objects.filter(user=target_user).filter(filters).order_by('-created_at')
        else:
            if not request.user.is_authenticated:
                return Response({"detail": "Authentication required to view your own lists."}, status=401)

            book_lists = BookList.objects.filter(user=request.user).order_by('-created_at')

        paginator = UserBookListsPagination()
        paginated_lists = paginator.paginate_queryset(book_lists, request)

        serializer = BookListSerializer(
            paginated_lists,
            many=True,
            context={
                'include_preview_books': True,
                'include_book_details': False
            }
        )
        return paginator.get_paginated_response(serializer.data)

class UploadAvatarView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get("avatar")
        if not file:
            return Response({"error": "No file uploaded."}, status=400)

        filename = f"{request.user.id}.jpg"
        upload_url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{filename}?upsert=true"

        headers = {
            "Authorization": f"Bearer {SUPABASE_API_KEY}",
            "Content-Type": file.content_type,
        }

        response = requests.post(upload_url, headers=headers, files={"file": file})

        if response.status_code == 200:
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{filename}"
            request.user.avatar = public_url
            request.user.save()
            return Response({"avatar_url": public_url})
        else:
            return Response({"error": "Failed to upload image to Supabase."}, status=500)

class EditUserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        avatar_file = request.FILES.get("avatar")
        data = request.data.copy()

        if avatar_file:
            # Delete old avatar if it exists
            old_avatar_url = request.user.avatar
            if old_avatar_url and "object/public/" in old_avatar_url:
                old_filename = old_avatar_url.split("/")[-1]
                delete_url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{old_filename}"
                headers = {"Authorization": f"Bearer {SUPABASE_API_KEY}"}
                requests.delete(delete_url, headers=headers)

            # Generate unique filename
            ext = avatar_file.name.split('.')[-1]
            unique_id = uuid.uuid4().hex
            new_filename = f"{request.user.id}-{unique_id}.{ext}"

            # Upload to Supabase
            upload_url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{new_filename}"
            headers = {
                "Authorization": f"Bearer {SUPABASE_API_KEY}",
                "Content-Type": avatar_file.content_type,
            }

            print("Uploading avatar to:", upload_url)
            print("Headers:", headers)
            avatar_file.seek(0)

            upload_response = requests.put(upload_url, data=avatar_file.read(), headers=headers)

            print("Upload response status code:", upload_response.status_code)
            print("Upload response text:", upload_response.text)

            if upload_response.status_code != 200:
                return Response({"error": "Failed to upload image to Supabase."}, status=500)

            public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{new_filename}"
            avatar_url_to_set = public_url
        else:
            avatar_url_to_set = None

        # Remove avatar from data
        data.pop("avatar", None)

        serializer = EditUserSerializer(request.user, data=data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            # Update avatar URL if one was uploaded
            if avatar_url_to_set:
                user.avatar = avatar_url_to_set
                user.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
