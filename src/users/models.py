from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name=None, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not first_name:
            raise ValueError('First name is required')

        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, first_name, last_name, password, **extra_fields)

class CustomUser(AbstractUser, PermissionsMixin):
    # Add custom fields here as needed
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, unique=False)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    followers = models.ManyToManyField("self", symmetrical=False, related_name="following", blank=True)

    @property
    def book_list_ids(self):
        return list(self.lists.values_list('id', flat=True))

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']


    def __str__(self):
            return self.email
