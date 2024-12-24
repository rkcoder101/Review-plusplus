from django.db import models
from .user import User

class Reviewer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviewers")

    def save(self, *args, **kwargs):
        
        self.user.is_reviewer = True
        self.user.save()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        
        self.user.is_reviewer = False
        self.user.save()
        super().delete(*args, **kwargs)
        
    def __str__(self):
        return f'Reviewer: {self.user.username}'
