from django.db import models
from .user import User  
from .assignment import Assignment  
from .reviewer import Reviewer
class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="submissions")
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    submission_date = models.DateTimeField(null= True)
    reviewer= models.ForeignKey(Reviewer, on_delete=models.CASCADE, related_name="reviewer_which_is_pinged")
    comments = models.TextField(blank=True, null=True)  
    checked = models.BooleanField(default=False)

    def __str__(self):
        return f'Submission by {self.user.username} for {self.assignment.title} on {self.submission_date}'
