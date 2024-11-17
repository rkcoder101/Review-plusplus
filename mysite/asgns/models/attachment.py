from django.db import models
from .subtask import Subtask
class Attachment(models.Model):
    file = models.FileField(upload_to='attachments/')  # For PDFs or other file types
    image = models.ImageField(upload_to='images/', blank=True, null=True)  # For images (optional)
    subtask= models.ForeignKey(Subtask, on_delete=models.CASCADE)  

    
