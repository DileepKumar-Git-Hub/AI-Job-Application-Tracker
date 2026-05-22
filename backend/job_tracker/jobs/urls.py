from django.urls import path
from .views import (
    all_jobs, 
    bookmark_job, 
    apply_job, 
    get_user_applied_jobs,
    get_user_bookmarked_jobs,
    update_applied_job_status
)

urlpatterns = [
    path('all/', all_jobs),
    path('bookmark/', bookmark_job, name='bookmark_job'),
    path('apply/', apply_job, name='apply_job'),
    path('user/applied/', get_user_applied_jobs, name='user_applied_jobs'),
    path('user/bookmarked/', get_user_bookmarked_jobs, name='user_bookmarked_jobs'),
    path('update-status/', update_applied_job_status, name='update_applied_status'),
]