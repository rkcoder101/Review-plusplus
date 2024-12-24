from django.db import models
from .user import User
from .assignment import Assignment
from .team import Team
class Assignment_Allocated_to(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='allocations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='assigned_assignments')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True, related_name='assigned_assignments')
    is_completed = models.BooleanField(default=False)

    def save(self, *args, **kwargs):        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Allocation for {self.assignment.title}"   

    