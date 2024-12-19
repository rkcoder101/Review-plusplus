from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models.user import User
from .serializer import UserSerializer, UsernameSerializer, TeamSerializer , AssignmentSerializer, AssignmentTitleSerializer, SubmissionSerializer , ReviewerSerializer, ReviewHistorySerializer
from .models.team import Team
from .models.assignment import Assignment
from .models.submission import Submission
from .models.reviewer import Reviewer
from .models.reviewhistory import ReviewHistory
from .models.subtask import Subtask
from .models.assignment_allocated_to import Assignment_Allocated_to
from .models.assignment_reviewers import AssignmentReviewer
from .models.attachment import Attachment
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

class TeamList(APIView):
     
    def get(self, request, format=None):
        teams = Team.objects.all()
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
        
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

class AssignmentDetails(APIView):
    def get_assignment(self, id):
        try:
            return Assignment.objects.get(id=id)
        except Assignment.DoesNotExist:
            raise Http404

    def get(self,request,id,format=None):
        assignment= self.get_assignment(id)
        
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, format=None):
        assignment= self.get_assignment(id)
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id, format=None):
        assignment = self.get_assignment(id)
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CreateSubmissions(APIView):
    def get(self, request, format=None):
        submissions = Submission.objects.all()
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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