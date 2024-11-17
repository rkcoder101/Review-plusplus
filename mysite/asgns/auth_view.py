from django.shortcuts import redirect
from rest_framework.views import APIView
import requests
from django.http import JsonResponse
from django.core.cache import cache  
from .models.user import User
from .models.administrator import Administrator
from .models.reviewer import Reviewer
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

        
        print("Response Status Code:", response.status_code)
        print("Response Text:", response.text)

        tokens = response.json()

        if response.status_code == 200:
            access_token = tokens.get("access_token")
            cache.set("access_token", access_token, timeout=tokens.get("expires_in"))            
            
            user_data_url = "http://127.0.0.1:8000/asgns/user_detail/"
            headers = {"Authorization": f"Bearer {access_token}"}
            user_data_response = requests.get(user_data_url, headers=headers)
            
            if user_data_response.status_code == 200:
                user_data = user_data_response.json()     
                
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
                    
                    if created:
                        print("New user created:", user.name)
                        
                    else:
                        if not Reviewer.objects.filter(user=user).exists():
                            Reviewer.objects.create(user=user)
                            print(f"{user.name} has been assigned as an Reviewer.")
                        else:
                            print(f"{user.name} is already an Reviewer.")
                            print("User already exists:", user.name)                    
                    
                    return redirect('http://localhost:5173/dashboard')
                else:
                    
                    return JsonResponse({"error": "Enrollment number missing"}, status=400)
            else:
                return JsonResponse({"error": "Failed to fetch user data"}, status=user_data_response.status_code)
        else:
            return JsonResponse({"error": tokens.get("error", "Failed to obtain tokens")}, status=response.status_code)


class UserDataView(APIView):
    def get(self, request):
        access_token = cache.get("access_token")
        print("Access Token Retrieved:", access_token) 

        if not access_token:
            return JsonResponse({"error": "Access token is missing or expired. Please re-authenticate."}, status=401)

        user_data_url = "https://channeli.in/open_auth/get_user_data/"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        response = requests.get(user_data_url, headers=headers)

        if response.status_code == 200:
            return JsonResponse(response.json())
        else:
            return JsonResponse({"error": response.json().get("detail", "Failed to fetch user data")}, status=response.status_code)
