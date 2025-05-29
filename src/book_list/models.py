from django.db import models
from django.contrib.postgres.fields import ArrayField  # If you're using PostgreSQL

class BookList(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    isPublic = models.BooleanField(default=False)

    # Link to owner
    user = models.ForeignKey("users.CustomUser", related_name="lists", on_delete=models.CASCADE)

    # Shared visibility
    visible_to = models.ManyToManyField("users.CustomUser", related_name="shared_lists", blank=True)

    # Store external book IDs (as strings or integers, depending on your API)
    book_ids = ArrayField(models.IntegerField(), default=list, blank=True)

    def __str__(self):
        return f"{self.name} ({self.user.email})"
