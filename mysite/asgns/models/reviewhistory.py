from django.db import models
from .assignment import Assignment  
from .reviewer import Reviewer  
from .submission import Submission
class ReviewHistory(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="review_history")
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE, related_name="review_history")
    review_date = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f'Submission by {self.submission.user.username} reviewed by {self.reviewer.user.username} on {self.review_date}'
    
