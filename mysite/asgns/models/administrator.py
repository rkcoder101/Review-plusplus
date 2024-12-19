from django.db import models
from .user import User

class Administrator(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="administrator")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.user.is_admin = True
        self.user.save()

    def __str__(self):
        return f'Admin: {self.user.username}'
