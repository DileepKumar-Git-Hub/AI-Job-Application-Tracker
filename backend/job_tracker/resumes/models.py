from django.db import models
from django.contrib.auth.models import User

class Resume(models.Model):
    user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='resumes',
    )
    name = models.CharField(max_length=200)
    resume = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    parsed_text = models.TextField(blank=True, default='')
    headline = models.CharField(max_length=500, blank=True, default='')
    summary = models.TextField(blank=True, default='')
    skills = models.JSONField(blank=True, default=list)
    experience = models.TextField(blank=True, default='')
    education = models.TextField(blank=True, default='')
    contact_info = models.TextField(blank=True, default='')

    def __str__(self):
        return self.name
