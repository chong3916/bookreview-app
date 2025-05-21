from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'is_staff')
    search_fields = ('email', 'username')
    ordering = ('date_joined',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password', 'bio', 'avatar', 'followers')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_staff', 'is_active')}
         ),
    )

admin.site.register(CustomUser, CustomUserAdmin)
