from django.db import models
from .submission import Submission
class Attachment_for_submission(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to='attachments/')  # To store PDFs or other files
    image = models.ImageField(upload_to='images/', blank=True, null=True)  # For images (optional)
    
    date = models.DateTimeField(auto_now_add=True)

    