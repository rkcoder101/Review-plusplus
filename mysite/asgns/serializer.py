from rest_framework import serializers

from .models.assignment import Assignment
from .models.assignment_reviewers import AssignmentReviewer
from .models.attachment import Attachment
from .models.attachments_for_submissions import Attachment_for_submission
from .models.completed_assignment import Completed_Assignment
from .models.review import Review
from .models.reviewer import Reviewer
from .models.reviewhistory import ReviewHistory
from .models.submission import Submission
from .models.subtask import Subtask
from .models.team import Team
from .models.user import User



class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Assignment
        fields= '__all__'

class AssignmentTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Assignment
        fields= ['title']

class AssignmentReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model=AssignmentReviewer
        fields= '__all__'

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Attachment
        fields= '__all__'

class Attachment_for_submissionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Attachment_for_submission
        fields= '__all__'

class Completed_AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Completed_Assignment
        fields= '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model=Review
        fields= '__all__'

class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Reviewer
        fields= '__all__'

class ReviewHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model=ReviewHistory
        fields= '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Submission
        fields= ['user', 'assignment']

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model=Subtask
        fields= '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model=Team
        fields= '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields= '__all__'

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['name']