from django.urls import path
from .views import ResumeUploadView, ResumeLatestView

urlpatterns = [
    path('upload-resume/', ResumeUploadView.as_view()),
    path('latest/', ResumeLatestView.as_view()),
]