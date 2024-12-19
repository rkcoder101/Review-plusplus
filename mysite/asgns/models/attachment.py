from django.db import models
from .subtask import Subtask
class Attachment(models.Model):
    file = models.FileField(upload_to='attachments/')       
    subtask= models.ForeignKey(Subtask, on_delete=models.CASCADE)  

    
