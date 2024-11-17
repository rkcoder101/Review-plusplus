from django.db import models
from .user import User  
from .assignment import Assignment  

class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="submissions")
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    submission_date = models.DateTimeField(null= True)
    comments = models.TextField(blank=True, null=True)  
    

    def __str__(self):
        return f'Submission by {self.user.username} for {self.assignment.title} on {self.submission_date}'
