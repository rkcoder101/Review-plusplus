from django.db import models
from .user import User
from .assignment import Assignment

class Completed_Assignment(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='completed_assignments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='completed_assignments')
    date_of_completion = models.DateTimeField()

    def __str__(self):
        return f'{self.assignment.title} completed by {self.user.username} on {self.date_of_completion}'
