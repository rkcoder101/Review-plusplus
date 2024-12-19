from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):
     
    name = models.CharField(max_length=50)
    branch = models.CharField(max_length=50, null=True)
    enrollment_number = models.CharField(
        max_length=8,
        validators=[MinLengthValidator(8), MaxLengthValidator(8)],
        unique=True,  
        null=False,
        default='2311'
    )
    is_admin = models.BooleanField(default=False)
    is_reviewer = models.BooleanField(default=False)
    password = models.CharField(max_length=128, null=False, default=make_password('default_password'))

    def set_password(self, raw_password):
        """Hashes and sets the user's password."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Checks if the raw password matches the stored hashed password."""
        return check_password(raw_password, self.password)
    
    def __str__(self):
        return f'Name: {self.name} EnrollmentNo. {self.enrollment_number}'

   
