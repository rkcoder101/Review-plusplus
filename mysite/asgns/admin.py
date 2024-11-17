from django.contrib import admin

from .models.user import User
from .models.team import Team
from .models.assignment import Assignment
from .models.subtask import Subtask
from .models.attachment import Attachment 
from .models.submission import Submission
from .models.reviewer import Reviewer
from .models.reviewhistory import ReviewHistory
from .models.assignment_reviewers import AssignmentReviewer
from .models.review import Review
from .models.completed_assignment import Completed_Assignment
from .models.attachments_for_submissions import Attachment_for_submission
from .models.administrator import Administrator
# Register your models here.

admin.site.register(User)
admin.site.register(Team)
admin.site.register(Assignment)
admin.site.register(Subtask)
admin.site.register(Submission)
admin.site.register(Reviewer)
admin.site.register(ReviewHistory)
admin.site.register(Attachment)
admin.site.register(AssignmentReviewer)
admin.site.register(Review)
admin.site.register(Completed_Assignment)
admin.site.register(Attachment_for_submission)
admin.site.register(Administrator)




