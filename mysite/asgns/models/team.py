from django.db import models
from .user import User

class Team(models.Model):
    name = models.CharField(max_length=50)
    members = models.ManyToManyField(User)

    def __str__(self):
        return self.name
