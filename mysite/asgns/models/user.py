from django.db import models


from django.core.validators import MinLengthValidator, MaxLengthValidator
class User(models.Model):    
    password= models.CharField(max_length=30, null= True )    
    name= models.CharField(max_length=50)
    branch= models.CharField(max_length=50, null= True )
    enrollment_number = models.CharField(
        max_length=8,
        validators=[MinLengthValidator(8), MaxLengthValidator(8)]   
        , null= True       
    )
    
    
    
    
    def __str__(self):
        return f'Name: {self.name} EnrollmentNo. {self.enrollment_number}'