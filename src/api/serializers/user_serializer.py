from rest_framework import serializers
from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        print("here")
        print(validated_data)
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
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
        domain = get_current_site(self.context['request']).domain
        link = f"http://{domain}/activate/{uid}/{token}/"

        send_mail(
            subject='Activate your account',
            message=f'Click to activate: {link}',
            from_email='no-reply@yourapp.com',
            recipient_list=[user.email],
            fail_silently=False,
        )