from rest_framework import serializers

from .models.assignment import Assignment
from .models.assignment_reviewers import AssignmentReviewer
from .models.attachment import Attachment
from .models.attachments_for_submissions import Attachment_for_submission

from .models.review import Review
from .models.reviewer import Reviewer
from .models.reviewhistory import ReviewHistory
from .models.submission import Submission
from .models.subtask import Subtask
from .models.team import Team
from .models.user import User
from .models.assignment_allocated_to import Assignment_Allocated_to



class AssignmentTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Assignment
        fields= ['title']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model=Review
        fields= '__all__'

class ReviewerSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    enrollment_number= serializers.CharField(source='user.enrollment_number',read_only=True)
    class Meta:
        model = Reviewer
        fields = ['id', 'user', 'name', 'enrollment_number']  


class ReviewHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model=ReviewHistory
        fields= '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['name','members']  

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields= '__all__'

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['name']

class PendingAssignmentSerializer(serializers.ModelSerializer):
    assigner = serializers.CharField(source='assignment.assigner.user.name')  
    assignment__title= serializers.CharField(source='assignment.title')
    assignment__due_date= serializers.DateField(source='assignment.due_date')
    date_of_assigning=serializers.DateField(source='assignment.date_of_assigning')
    class Meta:
        model = Assignment_Allocated_to
        fields = ['assignment', 'assigner', 'is_completed', 'assignment__title', 'assignment__due_date','date_of_assigning']

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Attachment
        fields= ['file']

class SubtaskSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True, source='attachment_set')
    class Meta:
        model=Subtask
        fields = ['text', 'attachments']

class AssignmentSerializer(serializers.ModelSerializer):
    assigner = serializers.CharField(source='assigner.user.name') 
    subtasks = SubtaskSerializer(many=True, read_only=True, source='parent_assignment')
    class Meta:
        model=Assignment
        fields = ['title', 'date_of_assigning', 'due_date', 'assigner', 'subtasks']

class AssignmentReviewerSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.user.name')
    id=serializers.CharField(source='reviewer.id')
    class Meta:
        model = AssignmentReviewer
        fields = ['reviewer_name','id']

class Attachment_for_Submissions_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment_for_submission
        fields = ['id', 'file']

class SubmissionSerializer(serializers.ModelSerializer):
    attachments = Attachment_for_Submissions_Serializer(many=True, read_only=True)
    assigner= serializers.CharField(source='assignment.assigner.user.name')
    submission_by=serializers.CharField(source='user.name')
    assignment_title=serializers.CharField(source='assignment.title')
    class Meta:
        model = Submission
        fields = ['id', 'user', 'assignment', 'submission_date', 'reviewer', 'comments', 'attachments', 'checked','assigner','submission_by','assignment_title']