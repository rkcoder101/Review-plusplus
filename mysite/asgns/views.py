from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models.user import User
from .serializer import UserSerializer, UsernameSerializer, TeamSerializer , AssignmentSerializer, ForCreatingReviewSerializer,  AssignmentTitleSerializer, SubmissionSerializer , ReviewerSerializer, ReviewHistorySerializer, PendingAssignmentSerializer, AssignmentReviewerSerializer, ReviewSerializer
from .models.team import Team
from .models.administrator import Administrator
from .models.assignment import Assignment
from .models.submission import Submission
from .models.reviewer import Reviewer
from .models.review import Review
from .models.reviewhistory import ReviewHistory
from .models.subtask import Subtask
from .models.assignment_allocated_to import Assignment_Allocated_to
from .models.assignment_reviewers import AssignmentReviewer
from .models.attachment import Attachment
from .models.attachments_for_submissions import Attachment_for_submission
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from django.core.exceptions import ValidationError
from django.http import JsonResponse

class AddReviewer(APIView):
    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if not Reviewer.objects.filter(user=user).exists():
            Reviewer.objects.create(user=user)
        return JsonResponse({"message": f"{user.name} is now a reviewer.", "is_reviewer": True})

class RemoveReviewer(APIView):
    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        reviewer = Reviewer.objects.filter(user=user).first()
        if reviewer:
            reviewer.delete()
        return JsonResponse({"message": f"{user.name} is no longer a reviewer.", "is_reviewer": False})

class AddAdmin(APIView):
    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if not Administrator.objects.filter(user=user).exists():
            Administrator.objects.create(user=user)
        return JsonResponse({"message": f"{user.name} is now an admin.", "is_admin": True})

class RemoveAdmin(APIView):
    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        admin = Administrator.objects.filter(user=user).first()
        if admin:
            admin.delete()
        return JsonResponse({"message": f"{user.name} is no longer an admin.", "is_admin": False})

class RemoveAdmin(APIView):
    def post(self,request, user_id):
        user = get_object_or_404(User, id=user_id)
        admin = Administrator.objects.filter(user=user).first()
        if admin:
            admin.delete()
        return JsonResponse({"message": f"{user.name} is no longer an admin.", "is_admin": user.is_admin})

class UserList(APIView):   

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListforAssignment(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')  
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            users = User.objects.exclude(id=user_id)  
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)      
        

class UserDetail(APIView):

    def get_user(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, id, format=None):
        user = self.get_user(id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, id, format=None):
        user = self.get_user(id)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, format=None):
        user = self.get_user(id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)   
    
class ListTeams(APIView):
    def get(self,request):        
        team = Team.objects.all()
        serializer = TeamSerializer(team, many=True)
        return Response(serializer.data)
    
class CreateTeam(APIView):
     
    def post(self, request):
        data = request.data
        team_name = data.get('name')
        member_ids = data.get('members')

        if not team_name:
            return Response({"error": "Team name is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not member_ids or not isinstance(member_ids, list):
            return Response({"error": "Members list is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            team = Team.objects.create(name=team_name)
            members = User.objects.filter(id__in=member_ids)
            team.members.set(members)
            team.save()            
            return Response({"message": "Team created successfully!", "team_id": team.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserTeamsView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch teams where the user is a member
            teams = Team.objects.filter(members__id=user_id)
            serializer = TeamSerializer(teams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from django.shortcuts import get_object_or_404

class TeamDetails(APIView):

    def get(self, request, team_id):
        
        team = get_object_or_404(Team, id=team_id)
        
        
        members = team.members.values("id", "name", "enrollment_number")
        
        
        pending_assignments = Assignment_Allocated_to.objects.filter(team=team, is_completed=False).values(
            "assignment__id", "assignment__title","assignment__assigner__user__name"
        )
               
        data = {
            "id": team.id,
            "team_name": team.name,
            "members": list(members),
            "pending_assignments": list(pending_assignments),
        }
        
        return Response(data)
        
class CreateAssignmentView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    @transaction.atomic
    def post(self, request):
        try:
            # Extract main assignment data
            title = request.data.get('title')
            date_of_assigning = request.data.get('date_of_assigning')
            due_date = request.data.get('due_date')
            assigner_id = request.data.get('assigner_id')
            user_ids = request.data.getlist('user_ids')
            team_ids = request.data.getlist('team_ids')
            reviewer_ids = request.data.getlist('reviewer_ids')

            # Validate required fields
            if not title or not assigner_id:
                return Response({"error": "Title and Assigner ID are required."}, status=status.HTTP_400_BAD_REQUEST)

            # Create the assignment
            assignment = Assignment.objects.create(
                title=title,
                date_of_assigning=date_of_assigning,
                due_date=due_date,
                assigner_id=assigner_id
            )

            # Create relationships in Assignment_Allocated_to
            for user_id in user_ids:
                Assignment_Allocated_to.objects.create(assignment=assignment, user_id=user_id)

            for team_id in team_ids:
                Assignment_Allocated_to.objects.create(assignment=assignment, team_id=team_id)

            # Create relationships in AssignmentReviewer
            for reviewer_id in reviewer_ids:
                AssignmentReviewer.objects.create(assignment=assignment, reviewer_id=reviewer_id)

            # Handle subtasks and attachments
            subtasks = []
            for idx, text in enumerate(request.data.getlist('subtasks')):
                subtask = Subtask.objects.create(asgn=assignment, text=text)
                subtasks.append(subtask)

                # Handle attachments for the subtask
                files = request.FILES.getlist(f'subtask_{idx}_files')
                for file in files:
                    Attachment.objects.create(subtask=subtask, file=file)

            return Response({
                "message": "Assignment created successfully!",
                "assignment_id": assignment.id,
                "subtasks": [{"id": s.id, "text": s.text} for s in subtasks]
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class PendingAssignmentsView(APIView):  
    def get(self, request):
        user_id = request.GET.get('user_id')  
        if not user_id:
            return Response({"error": "user_id is required"}, status=400)        
        
        pending_assignments = Assignment_Allocated_to.objects.filter(user_id=user_id, is_completed=False)
        serializer = PendingAssignmentSerializer(pending_assignments, many=True)
        return Response(serializer.data)

class AssignmentDetails(APIView):
    def get(self, request, id):       
        try:            
            assignment = Assignment.objects.get(id=id)           
            
            serializer = AssignmentSerializer(assignment)
            
            # Return the serialized data
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Assignment.DoesNotExist:
            # Return a 404 error if the assignment does not exist
            return Response(
                {"error": "Assignment not found"},
                status=status.HTTP_404_NOT_FOUND
            ) 
class AssignmentReviewersView(APIView):
    def get(self, request, id):
        try:
            
            assignment = Assignment.objects.get(id=id)
            
            
            reviewers = AssignmentReviewer.objects.filter(assignment=assignment)           
            
            serializer = AssignmentReviewerSerializer(reviewers, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Assignment.DoesNotExist:
            return Response(
                {"error": "Assignment not found"},
                status=status.HTTP_404_NOT_FOUND
            )  


class CreateSubmissionView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Parse data from the request
            user_id = request.data.get("user")
            team_id = request.data.get("team")
            assignment_id = request.data.get("assignment")
            reviewer_id = request.data.get("reviewer")
            comments = request.data.get("comments")
            submission_date = request.data.get("submission_date", None)

            # Create the submission instance
            submission = Submission.objects.create(
                user_id=user_id,
                team_id=team_id,
                assignment_id=assignment_id,
                reviewer_id=reviewer_id,
                comments=comments,
                submission_date=submission_date
            )

            # Handle attachments
            if "attachments" in request.FILES:
                for file in request.FILES.getlist("attachments"):
                    Attachment_for_submission.objects.create(
                        submission=submission,
                        file=file
                    )

            # Serialize and return response
            serializer = SubmissionSerializer(submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PendingReview(APIView):
    def get(self, request, *args, **kwargs):
        # Get the user ID from the query parameters
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the reviewer object for the given user_id
            reviewer = Reviewer.objects.filter(user_id=user_id).first()
            if not reviewer:
                return Response({"error": "Reviewer not found for the given user ID."}, status=status.HTTP_404_NOT_FOUND)

            # Fetch submissions where `checked=False` and `reviewer_id` matches the reviewer's ID
            pending_submissions = Submission.objects.filter(reviewer_id=reviewer.id, checked=False)

            # Serialize the results
            serializer = SubmissionSerializer(pending_submissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReviewView(APIView):
     def get(self, request, submission_id):
        # Fetch the submission by ID
        submission = get_object_or_404(Submission, id=submission_id)
        
        # Fetch the associated assignment
        assignment = submission.assignment
        
        # Serialize the assignment with subtasks and attachments
        assignment_data = AssignmentSerializer(assignment).data
        
        # Fetch previous submissions for the same assignment, submitter, and reviewer
        previous_submissions = Submission.objects.filter(
            assignment=assignment,
            user=submission.user,
            reviewer=submission.reviewer
        ).exclude(id=submission_id)  # Exclude the current submission
        
        # Serialize the previous submissions with attachments
        previous_submissions_data = SubmissionSerializer(previous_submissions, many=True).data
        if submission.team:
            allocation = Assignment_Allocated_to.objects.filter(
                assignment_id=assignment.id,
                team_id=submission.team.id
            ).first()
            print(f"team found: {submission.team.name}")
        elif submission.user:
            allocation = Assignment_Allocated_to.objects.filter(
                assignment_id=assignment.id,
                user_id=submission.user.id
            ).first()
            print(f"user found: {submission.user.name}")
        else:
            allocation = None
        is_completed = allocation.is_completed if allocation else False
        # Response structure
        response_data = {
            "current_submission": SubmissionSerializer(submission).data,
            "assignment_details": assignment_data,
            "previous_submissions": previous_submissions_data,
            "is_completed": is_completed
        }
        
        return Response(response_data)
        
class SubmissionHistory(APIView):  
    
    def get(self, request, id, *args, **kwargs):        
        try:
            
            submissions = Submission.objects.filter(user_id=id)
            
           
            serializer = SubmissionSerializer(submissions, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Submission.DoesNotExist:
            return Response({"error": "Submissions not found for the given user."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReviewerList(APIView):
     
    def get(self, request, format=None):
        reviewers = Reviewer.objects.all()
        serializer = ReviewerSerializer(reviewers, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ReviewerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Review_History(APIView):
    
    def get(self, request, id ):
        reviewer = Reviewer.objects.get(user=id)
        reviews = Review.objects.filter(submission__reviewer=reviewer).select_related('submission')

        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

from django.conf import settings
import os
from django.http import HttpResponse

def serve_file(request, file_path):
    # Construct the full file path
    full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)

    if os.path.exists(full_file_path):
        with open(full_file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(full_file_path)}"'
            return response
    else:
        return HttpResponse("File not found", status=404)
    
class CreateReviewView(APIView):
    def post(self, request):
        try:
            data = request.data
            print(f"Request data: {data}")

            submission_id = data.get("submission")
            if not submission_id:
                return Response({"error": "Submission ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                submission = Submission.objects.get(id=submission_id)
                submission.checked = True
                submission.save()
                print(f"Submission {submission_id} marked as checked.")
            except Submission.DoesNotExist:
                return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)

            # Serialize and save the review
            serializer = ForCreatingReviewSerializer(data=data)
            if serializer.is_valid():
                review = serializer.save()
                print(f"Review created successfully: {review}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Exception occurred: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.middleware.csrf import get_token
def csrf_view(request):    
    return JsonResponse({'csrfToken': get_token(request)})

def mark_as_completed(request, allocation_id):
    if request.method == "POST":
        allocation = get_object_or_404(Assignment_Allocated_to, id=allocation_id)
        allocation.is_completed = True
        allocation.save()
        return JsonResponse({"success": True, "message": "Assignment marked as completed."})
    return JsonResponse({"success": False, "message": "Invalid request method."}, status=400)

class ReviewsForAssignmentView(APIView):
    def get(self, request, assignment_id, user_id):
        try:
            reviews = Review.objects.filter(
                submission__assignment_id=assignment_id,
                submission__user_id=user_id
            )
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReviewsForAssignmentViewforTeam(APIView):
    def get(self, request, assignment_id, team_id):
        try:
            reviews = Review.objects.filter(
                submission__assignment_id=assignment_id,
                submission__team_id=team_id
            )
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetPasswordView(APIView):    

    def post(self, request):
        user_id = request.data.get("user_id")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not new_password or not confirm_password:
            return Response({"error": "Both fields are required."}, status=400)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=400)  

        user=User.objects.get(id=user_id)      

        user.set_password(new_password)
        user.save()
        return Response({"success": "Password reset successfully."}, status=200)