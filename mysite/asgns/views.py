from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models.user import User
from .serializer import UserSerializer, UsernameSerializer, TeamSerializer , AssignmentSerializer, AssignmentTitleSerializer, SubmissionSerializer , ReviewerSerializer, ReviewHistorySerializer, PendingAssignmentSerializer, AssignmentReviewerSerializer, ReviewSerializer
from .models.team import Team
from .models.assignment import Assignment
from .models.submission import Submission
from .models.reviewer import Reviewer
from .models.reviewhistory import ReviewHistory
from .models.subtask import Subtask
from .models.assignment_allocated_to import Assignment_Allocated_to
from .models.assignment_reviewers import AssignmentReviewer
from .models.attachment import Attachment
from .models.attachments_for_submissions import Attachment_for_submission
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction

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
            # Parse submission data from request
            user_id = request.data.get("user")
            assignment_id = request.data.get("assignment")
            reviewer_id = request.data.get("reviewer")
            comments = request.data.get("comments")
            submission_date=request.data.get("submission_date", None)
            # Create submission instance
            submission = Submission.objects.create(
                user_id=user_id,
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

from django.shortcuts import get_object_or_404
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
        
        # Response structure
        response_data = {
            "current_submission": SubmissionSerializer(submission).data,
            "assignment_details": assignment_data,
            "previous_submissions": previous_submissions_data,
        }
        
        return Response(response_data)
        
class SubmissionHistory(APIView):
    def get_user(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            raise Http404
    
    def get(self, request, id ,format= None ):
        user = self.get_user(id)  
        submissions = Submission.objects.filter(user=user)  
        serializer = SubmissionSerializer(submissions, many=True)  
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    def get_reviewer(self, id):
        try:
            return Reviewer.objects.get(id=id)
        except User.DoesNotExist:
            raise Http404
    def get(self, request, id , format=None):
        reviewer= self.get_reviewer(id)
        reviewhistory = ReviewHistory.objects.filter(reviewer=reviewer)
        serializer = ReviewHistorySerializer(reviewhistory, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ReviewHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
            # Extract data from request
            data = request.data
            
            # Ensure the submission exists
            submission_id = data.get("submission")
            if not submission_id:
                return Response({"error": "Submission ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                submission = Submission.objects.get(id=submission_id)
                submission.checked = True
                submission.save()  # Save the updated state to the database
                print("checked")  # Confirm the update
            except Submission.DoesNotExist:
                return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)

            # Serialize and save the review
            serializer = ReviewSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
