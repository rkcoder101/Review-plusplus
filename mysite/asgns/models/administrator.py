from django.db import models
from .user import User

class Administrator(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="administrator")

    def save(self, *args, **kwargs):
        
        self.user.is_admin = True
        self.user.save()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        
        self.user.is_admin = False
        self.user.save()
        super().delete(*args, **kwargs)

    def __str__(self):
        return f'Admin: {self.user.username}'
