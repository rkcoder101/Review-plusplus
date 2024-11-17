from django.db import models
from .user import User

class Reviewer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviewers")

    def __str__(self):
        return f'Reviewer: {self.user.username}'
