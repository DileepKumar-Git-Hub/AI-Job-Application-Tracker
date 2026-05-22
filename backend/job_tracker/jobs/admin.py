from django.contrib import admin
from .models import Job, BookmarkedJob, AppliedJob


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'source', 'created_at')
    list_filter = ('source', 'created_at')
    search_fields = ('title', 'company', 'location')
    readonly_fields = ('external_id', 'created_at')


@admin.register(BookmarkedJob)
class BookmarkedJobAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'bookmarked_at')
    list_filter = ('bookmarked_at', 'user')
    search_fields = ('user__username', 'job__title')


@admin.register(AppliedJob)
class AppliedJobAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'status', 'applied_at')
    list_filter = ('status', 'applied_at', 'user')
    search_fields = ('user__username', 'job__title')

