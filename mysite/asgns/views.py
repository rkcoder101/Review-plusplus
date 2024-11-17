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
    def get(self, request, format=None):
        teams = Team.objects.all()
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
    def post(self,request,format=None):
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TeamDetails(APIView):
    def get_team(self, id):
        try:
            return Team.objects.get(id=id)
        except Team.DoesNotExist:
            raise Http404

    def get(self,request,id,format=None):
        team= self.get_team(id)
        users= team.members.all()           
        serializer = UsernameSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, format=None):
        team= self.get_team(id)
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id, format=None):
        team = self.get_team(id)
        team.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CreateAssignment(APIView):
    def get(self, request, format=None):
        assignment = Assignment.objects.all()
        serializer = AssignmentTitleSerializer(assignment, many=True)
        return Response(serializer.data)
    def post(self,request,format=None):
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class CreateReviewers(APIView):
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