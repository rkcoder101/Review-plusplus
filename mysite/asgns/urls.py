from django.urls import path
from asgns import views
from asgns import auth_view
urlpatterns = [
    path('users/', views.UserList.as_view(), name= 'get_users' ),
    path('users/<int:id>/', views.UserDetail.as_view(), name= 'get_users' ),   
    path('teams/', views.CreateTeam.as_view(), name='team-create'),    
    path('user-teams/',views.UserTeamsView.as_view(),name='teams of a user') ,
    path('assignments/<int:id>/', views.AssignmentDetails.as_view(), name= 'assignment_details'),
    path('create-assignment/', views.CreateAssignmentView.as_view(), name='create-assignment'),    
    path('users/<int:id>/submissionhistory/', views.SubmissionHistory.as_view(), name='submission_history'),
    path('reviewers/', views.ReviewerList.as_view(), name='reviewers'),
    path('users/<int:id>/reviewhistory', views.Review_History.as_view(), name='reviewhistory'),
    path('authorize/',auth_view.OAuthAuthorizeView.as_view(), name='oauth_authorize'),
    path('callback/', auth_view.OAuthCallbackView.as_view(), name='oauth_callback'),
    path('user_detail/', auth_view.UserDataView.as_view(), name='user_data'),
    path('login/',auth_view.LoginView.as_view(), name='login'),
    path('logout/', auth_view.LogoutView.as_view(), name='logout'),    
    path('pending-assignments/', views.PendingAssignmentsView.as_view(), name='pending-assignments'),
    path('media/<path:file_path>/', views.serve_file, name='serve_file'),
    path('assignments/<int:id>/reviewers/', views.AssignmentReviewersView.as_view(), name='assignment-reviewers'),
    path('create-submission/', views.CreateSubmissionView.as_view(), name='create_submission'),
    path('pending-reviews/', views.PendingReview.as_view(), name='pending-reviews'),
    path('review/<int:submission_id>/', views.ReviewView.as_view(), name='review'),
    path('review/create/', views.CreateReviewView.as_view(), name='create_review'),
    path('userlistforasgn/',views.UserListforAssignment.as_view(),name='user-list-for-assignment'),
]