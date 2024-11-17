from django.urls import path
from asgns import views
from asgns import auth_view
urlpatterns = [
    path('users/', views.UserList.as_view(), name= 'get_users' ),
    path('users/<int:id>/', views.UserDetail.as_view(), name= 'get_users' ),
    path('teams/', views.CreateTeam.as_view(), name='create_team'),
    path('teams/<int:id>/', views.TeamDetails.as_view(), name= 'team_details'),
    path('assignments/', views.CreateAssignment.as_view(), name= 'create_assignment'),
    path('assignments/<int:id>/', views.AssignmentDetails.as_view(), name= 'assignment_details'),
    path('submissions/', views.CreateSubmissions.as_view(), name= 'create_submission'),
    path('users/<int:id>/submissionhistory/', views.SubmissionHistory.as_view(), name='submission_history'),
    path('reviewers/', views.CreateReviewers.as_view(), name='reviewers'),
    path('users/<int:id>/reviewhistory', views.Review_History.as_view(), name='reviewhistory'),
    path('authorize/',auth_view.OAuthAuthorizeView.as_view(), name='oauth_authorize'),
    path('callback/', auth_view.OAuthCallbackView.as_view(), name='oauth_callback'),
    path('user_detail/', auth_view.UserDataView.as_view(), name='user_data'),
]