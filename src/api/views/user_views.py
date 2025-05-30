from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView

from api.serializers.book_list_serializer import BookListSerializer
from book_list.models import BookList
from users.models import CustomUser
from api.serializers.user_serializer import UserSerializer, CurrentUserSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model, authenticate
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError



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
            return Response({"message": "Account activated!"}, status=status.HTTP_200_OK)
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
            return Response({'access': access_token}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserBookListsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        book_lists = BookList.objects.filter(user=request.user)
        serializer = BookListSerializer(book_lists, many=True, context={'include_preview_books': True, 'include_book_details': False})
        return Response(serializer.data)
