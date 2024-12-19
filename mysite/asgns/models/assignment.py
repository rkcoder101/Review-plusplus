from django.db import models
from django.contrib.postgres.fields import ArrayField
from .reviewer import Reviewer
from .user import User
class Assignment(models.Model):
    title = models.CharField(max_length=200)    
    date_of_assigning=models.DateField(null= True)
    due_date=models.DateField(null= True)
    
    assigner=models.ForeignKey(Reviewer , on_delete=models.CASCADE, null= True)
    def __str__(self):
        return self.title