from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models.user import User 

class EnrollmentNumberBackend(BaseBackend):
    def authenticate(self, request, enrollment_number=None, password=None):
        try:
            user = User.objects.get(enrollment_number=enrollment_number)
            if user and check_password(password, user.password):
                return user
        except User.DoesNotExist:
            return None

    
