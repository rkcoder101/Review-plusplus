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
    asgn_title = serializers.CharField(source='submission.assignment.title')
    submission_date = serializers.DateTimeField(source='submission.submission_date')    
    submitted_by_user=serializers.CharField(source='submission.user.name')
    submitted_by_team=serializers.CharField(source='submission.team')
    reviewer_name = serializers.CharField(source='submission.reviewer.user.name')
    class Meta:
        model = Review
        fields = ['id', 'asgn_title', 'submission_date', 'reviewer_name','comments', 'date','submitted_by_user','submitted_by_team']
class ForCreatingReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
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
        fields = ['id','name','members']  

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
    assigner = serializers.CharField(source='assignment.assigner.user.name', read_only=True)
    submission_by = serializers.SerializerMethodField()
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    team_name = serializers.SerializerMethodField()
    reviewer_name = serializers.CharField(source='reviewer.user.name', read_only=True)
    allocation = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            'id', 'user', 'assignment', 'submission_date', 'reviewer', 'comments',
            'attachments', 'checked', 'assigner', 'submission_by', 
            'assignment_title', 'team_name', 'reviewer_name', 'allocation'
        ]

    def get_submission_by(self, obj):
        """Return the name of the user or team who made the submission."""
        if obj.user:
            return obj.user.name
        elif obj.team:
            return obj.team.name
        return None

    def get_team_name(self, obj):
        """Return the team name if the submission is by a team."""
        return obj.team.name if obj.team else None

    def get_allocation(self, obj):
        
        allocation = None
        if obj.team:
            allocation = Assignment_Allocated_to.objects.filter(
                assignment=obj.assignment,
                team=obj.team
            ).first()
        elif obj.user:
            allocation = Assignment_Allocated_to.objects.filter(
                assignment=obj.assignment,
                user=obj.user
            ).first()
        return allocation.id if allocation else None
