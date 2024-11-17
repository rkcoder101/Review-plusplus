from django.db import models
from .assignment import Assignment  
from .user import User  
from .submission import Submission  
from .reviewer import Reviewer
class Review(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE, related_name="reviews_given")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews_received")
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="submission_reviews")
    date = models.DateTimeField()
    comments = models.TextField()
    iteration_no = models.IntegerField()

    def __str__(self):
        return f'Review of {self.assignment.title} by {self.reviewer.user.username} for {self.user.username}'
