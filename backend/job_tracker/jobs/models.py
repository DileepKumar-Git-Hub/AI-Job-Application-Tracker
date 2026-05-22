from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    external_id = models.CharField(max_length=500, unique=True, null=True, blank=True)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    salary = models.CharField(max_length=100, blank=True)
    apply_url = models.URLField()
    source = models.CharField(max_length=100)  # RemoteOK, ArbeitNow, etc.
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} at {self.company}"


class BookmarkedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    bookmarked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'job']
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.job.title}"


class AppliedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applied_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('applied', 'Applied'),
            ('interview', 'Interview'),
            ('offer', 'Offer'),
            ('rejected', 'Rejected'),
        ],
        default='applied'
    )
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['user', 'job']
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.user.username} applied to {self.job.title}"
