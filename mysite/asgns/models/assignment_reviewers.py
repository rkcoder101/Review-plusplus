from django.db import models
from .reviewer import Reviewer
from .assignment import Assignment
class AssignmentReviewer(models.Model):
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE, related_name="assignments")
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="reviewers")
     

    def __str__(self):
        return f'Reviewer {self.reviewer.user.name} for Assignment {self.assignment.title}'