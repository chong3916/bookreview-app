from rest_framework import serializers
from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        print(validated_data)
        user = CustomUser.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data.get('last_name', ''),
            email=validated_data['email'],
            password=validated_data['password']
        )

        user.is_active = False
        user.save()

        # send email confirmation
        self.send_activation_email(user)

        return user

    def send_activation_email(self, user):
        from django.core.mail import send_mail
        from django.contrib.sites.shortcuts import get_current_site
        from django.urls import reverse
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        request = self.context.get('request')
        domain = get_current_site(request).domain if request else 'example.com'

        link = f"http://{domain}/activate/{uid}/{token}/"

        send_mail(
            subject='Activate your account',
            message=f'Click to activate: {link}',
            from_email='no-reply@yourapp.com',
            recipient_list=[user.email],
            fail_silently=False,
        )

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'avatar', 'id']
