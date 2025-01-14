from django.shortcuts import redirect
from rest_framework.views import APIView
import requests
from django.http import JsonResponse, HttpResponseRedirect
from django.core.cache import cache  
from .models.user import User
from .models.administrator import Administrator
from .models.reviewer import Reviewer
from datetime import timedelta
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class OAuthAuthorizeView(APIView):
    def get(self, request):
        client_id = 'F3CNh2SELPOkZv9ILDxSwoZRZhfa0PFu9edHw7pN'
        redirect_uri = 'http://127.0.0.1:8000/asgns/callback/'  
        state = 'success'

        auth_url = f"https://channeli.in/oauth/authorise/?client_id={client_id}&redirect_uri={redirect_uri}&state={state}"
        
        return redirect(auth_url)


class OAuthCallbackView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return JsonResponse({"error": "Authorization code not found."}, status=400)

        token_url = "https://channeli.in/open_auth/token/"
        data = {
            "client_id": 'F3CNh2SELPOkZv9ILDxSwoZRZhfa0PFu9edHw7pN',
            "client_secret": 'SLVMwonoJ3Inrsuak66QpNSnuZ0IfgnpWU0zuqDGE2S3iqKImvLyk68YxX4SGxlAEP8Ezzpl0OUCJheC6Ez7ukVI3knliGRE5H3RrTna8B1pP2u3LDNAPnzqhf3WCIlm',
            "grant_type": "authorization_code",
            "redirect_uri": 'http://127.0.0.1:8000/asgns/callback/',  
            "code": code,
        }
        
        
        response = requests.post(token_url, data=data)        
        
        # print("Response Status Code:", response.status_code)
        # print("Response Text:", response.text)

        try:
            tokens = response.json()
        except requests.exceptions.JSONDecodeError:
            return JsonResponse({"error": "Invalid response from token endpoint", "details": response.text}, status=500)


        if response.status_code == 200:
            access_token = tokens.get("access_token")
            cache.set("access_token", access_token, timeout=tokens.get("expires_in"))            
            expires_in = tokens.get("expires_in", 3600)
            user_data_url = "https://channeli.in/open_auth/get_user_data/"
            headers = {"Authorization": f"Bearer {access_token}"}
            user_data_response = requests.get(user_data_url, headers=headers)
            
            if user_data_response.status_code == 200:
                user_data = user_data_response.json()     
                # print(user_data)
                enrollment_number = user_data["student"].get("enrolmentNumber")
                full_name = user_data["person"].get("fullName", "Unknown User")
                branch = user_data["student"].get("branch name")                
                
                if enrollment_number:
                    user, created = User.objects.get_or_create(
                        enrollment_number=enrollment_number,
                        defaults={
                            'name': full_name,
                            'branch': branch,
                        }
                    )

                    user.is_admin = Administrator.objects.filter(user=user).exists()
                    user.is_reviewer = Reviewer.objects.filter(user=user).exists()
                    user.save()

                    if created:
                        print("New user created:", user.name)
                        
                    else:
                        
                        print("User already exists:", user.name)  

                    response = redirect('http://localhost:5173/dashboard')  
                    # print("Setting access_token cookie:", access_token)          
                    response.set_cookie(
                        'access_token', access_token,
                        httponly=True,
                        max_age=timedelta(seconds=expires_in),
                        samesite='None',
                        secure=True,
                        domain= None ,
                    )    
                    return response
                else:
                    
                    return JsonResponse({"error": "Enrollment number missing"}, status=400)
            else:
                return JsonResponse({"error": "Failed to fetch user data"}, status=user_data_response.status_code)
            
        else:
            return JsonResponse({"error": tokens.get("error", "Failed to obtain tokens")}, status=response.status_code)


class UserDataView(APIView):
    def get(self, request):
        # Retrieve the access token from the cache
        # print("Cookies received:", request.COOKIES)
        access_token = request.COOKIES.get('access_token')
        # print("Access Token Retrieved: mr_malicious ", access_token)

        if not access_token:
            return JsonResponse({"error": "Access token is missing or expired. Please re-authenticate."}, status=401)

        # Fetch user data using the access token
        user_data_url = "https://channeli.in/open_auth/get_user_data/"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        response = requests.get(user_data_url, headers=headers)

        if response.status_code == 200:
            
            user_data = response.json()            
            enrollment_number = user_data["student"].get("enrolmentNumber")

            try:
                user = User.objects.get(enrollment_number=enrollment_number)
                
                response_data = {
                    "id": user.id,
                    "name": user.name,
                    "is_admin": user.is_admin,
                    "is_reviewer": user.is_reviewer,
                    "enrollment_number": user.enrollment_number,
                    "branch": user.branch,
                }
                if user.is_reviewer:                    
                    reviewer = get_object_or_404(Reviewer, user=user)
                    response_data["reviewer_id"] = reviewer.id

                if user.is_admin:
                    administrator = get_object_or_404(Administrator, user=user)
                    response_data["admin_id"] = administrator.id

                return JsonResponse(response_data)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)
        else:
            return JsonResponse({"error": response.json().get("detail", "Failed to fetch user data")}, status=response.status_code)
        
class CookieAuthentication(BaseAuthentication):
    def authenticate(self, request):

        access_token = request.COOKIES.get('access_token')        
        if not access_token:
            raise AuthenticationFailed('No access token provided.')
                
        user_data_url = "https://channeli.in/open_auth/get_user_data/"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        response = requests.get(user_data_url, headers=headers)
        
        if response.status_code != 200:
            raise AuthenticationFailed('Invalid or expired access token.')
        
        user_data = response.json()
        enrollment_number = user_data["student"].get("enrolmentNumber")        
        
        user = User.objects.get(enrollment_number=enrollment_number)
        print("Yayy! Cookie auth worked!!")
        return (user, None) 


class LoginView(APIView):
    def post(self, request):
        enrollment_number = request.data.get('enrollment_number')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(enrollment_number=enrollment_number)
        except User.DoesNotExist:
            raise AuthenticationFailed('User with this enrollment number does not exist.')

        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password.')
        
        response = Response({"message": "Password authentication successful"})
        response.set_cookie(
            'password_token', user.id,
            httponly=True,            
            samesite='None',
            secure=True,
            domain= None ,
            )    
        return response

    def get(self, request):        
           
        # print(f"LoginView GET has been hit with token: {password_token}")

        if not (request.COOKIES.get('password_token')):
            raise AuthenticationFailed('Not authenticated.')

        password_token = request.COOKIES.get('password_token')
        try:
            user = User.objects.get(id=password_token)
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found.')

       
        user_data = {
            "id": user.id,
            "name": user.name,
            "enrollment_number": user.enrollment_number,
            "branch": user.branch,
            "is_admin": user.is_admin,
            "is_reviewer": user.is_reviewer,
        }
        if user.is_reviewer:
            reviewer = get_object_or_404(Reviewer, user=user)
            user_data["reviewer_id"] = reviewer.id

        if user.is_admin:
            administrator = get_object_or_404(Administrator, user=user)
            user_data["admin_id"] = administrator.id
        
        return Response(user_data)
    

class LogoutView(APIView):
    def post(self, request):
        response = Response({'message': 'Logout successful'})

        response.delete_cookie(
            'password_token', 
            path='/',        
            domain= None ,
            samesite='None',           
                   
            )  
        response.delete_cookie(
            'access_token', 
            path='/',        
            domain= None ,
            samesite='None',           
                   
            ) 
        access_token= request.COOKIES.get('access_token')
        password_token = request.COOKIES.get('password_token')
        print(f"Password Token:{password_token}")
        print (f"Access Token:{access_token}")        
        print ("logout done")
        return response

class SampleCookieSet(APIView):
    def post(self,request):
        response= Response({"message":"cookie is set"})
        response.set_cookie(
            "samplecookie", "sample value",
            httponly=True,            
            samesite='None',
            secure=True,
            domain= None ,
            )    
        return response

class SampleCookieDelete(APIView):
    def post(self,request):
        response= Response({"message":"cookie is deleted"})
        response.delete_cookie(
            'samplecookie',    
            path='/',        
            domain= None ,
            )    
        return response


    
