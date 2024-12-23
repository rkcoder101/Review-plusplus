from django.db import models
from .assignment import Assignment  
from .user import User  
from .submission import Submission  
from .reviewer import Reviewer
class Review(models.Model):   
    
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="submission_reviews")
    date = models.DateTimeField()
    comments = models.TextField()
    

    
