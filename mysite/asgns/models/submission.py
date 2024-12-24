from django.db import models
from django.core.exceptions import ValidationError
from .user import User
from .assignment import Assignment
from .reviewer import Reviewer
from .team import Team  

class Submission(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="submissions",
        help_text="The user making the submission, either for themselves or on behalf of a team.",
        null=True
    )
    team = models.ForeignKey(
        Team, 
        on_delete=models.CASCADE, 
        related_name="team_submissions", 
        null=True, 
        blank=True
    )
    assignment = models.ForeignKey(
        Assignment, 
        on_delete=models.CASCADE, 
        related_name="submissions"
    )
    submission_date = models.DateTimeField(null=True)
    reviewer = models.ForeignKey(
        Reviewer, 
        on_delete=models.CASCADE, 
        related_name="reviewer_which_is_pinged"
    )
    comments = models.TextField(blank=True, null=True)
    checked = models.BooleanField(default=False)

    def __str__(self):
        team_or_user = f"Team {self.team.name}" if self.team else f"User {self.user.username}"
        return f"Submission by {team_or_user} for {self.assignment.title}"

    def clean(self):        
        super().clean()
        if not self.user:
            raise ValidationError("Submission must have a user associated with it.")
