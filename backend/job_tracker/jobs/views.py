from django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services.job_services import get_all_jobs
from .models import Job, BookmarkedJob, AppliedJob
import json


@api_view(['GET'])
def all_jobs(request):

    try:

        # -----------------------------
        # CACHE
        # -----------------------------

        cached_jobs = cache.get("all_jobs")

        if cached_jobs:

            jobs = cached_jobs

        else:

            jobs = get_all_jobs()

            cache.set(
                "all_jobs",
                jobs,
                timeout=60 * 30
            )

        # Add user-specific data (bookmarks, applied status)
        user_id = request.user.id if request.user.is_authenticated else None
        
        if user_id:
            bookmarked_job_ids = set(
                BookmarkedJob.objects.filter(user_id=user_id).values_list('job__external_id', flat=True)
            )
            applied_job_ids = set(
                AppliedJob.objects.filter(user_id=user_id).values_list('job__external_id', flat=True)
            )
            
            for job in jobs:
                job['is_bookmarked'] = job.get('id') in bookmarked_job_ids
                job['is_applied'] = job.get('id') in applied_job_ids
        else:
            for job in jobs:
                job['is_bookmarked'] = False
                job['is_applied'] = False

        # -----------------------------
        # SEARCH
        # -----------------------------

        query = request.GET.get("q", "").lower()

        if query:
            jobs = [
                job for job in jobs
                if query in (job.get("title") or "").lower()
                or query in (job.get("company") or "").lower()
                or query in (job.get("description") or "").lower()
                or any(query in str(skill).lower() for skill in (job.get("skills") or []))
            ]

        # -----------------------------
        # LOCATION FILTER
        # -----------------------------

        location = request.GET.get("location", "").lower()

        if location:
            jobs = [
                job for job in jobs
                if location in (job.get("location") or "").lower()
            ]

        # -----------------------------
        # SOURCE FILTER
        # -----------------------------

        source = request.GET.get("source", "").lower()

        if source:
            jobs = [
                job for job in jobs
                if source == (job.get("source") or "").lower()
            ]

        # -----------------------------
        # SKILLS FILTER
        # -----------------------------

        skills = request.GET.get("skills", "").lower()

        if skills:
            skill_list = [s.strip() for s in skills.split(",")]
            jobs = [
                job for job in jobs
                if any(
                    any(skill in str(job_skill).lower() for skill in skill_list)
                    for job_skill in (job.get("skills") or [])
                )
            ]

        # Tag filter (backward compatible)
        tag = request.GET.get("tag", "").lower()

        if tag:
            jobs = [
                job for job in jobs
                if tag in [
                    t.lower()
                    for t in (job.get("tags") or [])
                ]
            ]

        # Only bookmarked
        only_bookmarked = request.GET.get("only_bookmarked", "false").lower() == "true"
        if only_bookmarked and user_id:
            jobs = [job for job in jobs if job.get('is_bookmarked', False)]

        # Only applied
        only_applied = request.GET.get("only_applied", "false").lower() == "true"
        if only_applied and user_id:
            jobs = [job for job in jobs if job.get('is_applied', False)]

        # -----------------------------
        # SORTING
        # -----------------------------

        sort_by = request.GET.get("sort_by", "recent")
        sort_order = request.GET.get("sort_order", "desc")

        if sort_by == "title":
            jobs.sort(key=lambda x: (x.get("title") or "").lower(), reverse=(sort_order == "desc"))
        elif sort_by == "company":
            jobs.sort(key=lambda x: (x.get("company") or "").lower(), reverse=(sort_order == "desc"))
        elif sort_by == "salary":
            # Sort by salary (handle "Not specified" cases)
            def get_salary_value(job):
                salary = job.get("salary", "Not specified")
                if salary == "Not specified":
                    return -1
                try:
                    return int(salary.replace(",", ""))
                except:
                    return -1
            jobs.sort(key=get_salary_value, reverse=(sort_order == "desc"))
        else:  # recent (default)
            pass  # Already sorted by creation time

        # Total jobs count before pagination
        total_jobs = len(jobs)

        # -----------------------------
        # PAGINATION
        # -----------------------------

        page = int(
            request.GET.get("page", 1)
        )

        page_size = int(request.GET.get("page_size", 20))

        start = (page - 1) * page_size
        end = start + page_size

        paginated_jobs = jobs[start:end]

        return Response({
            "success": True,
            "total_jobs": total_jobs,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_jobs + page_size - 1) // page_size,
            "jobs": paginated_jobs
        })

    except Exception as e:

        return Response({
            "success": False,
            "error": str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bookmark_job(request):
    """Toggle bookmark for a job"""
    try:
        job_id = request.data.get('job_id')
        job_data = request.data.get('job_data')  # Full job data if job doesn't exist in DB
        
        # Get or create job in database
        job, created = Job.objects.get_or_create(
            external_id=job_id,
            defaults={
                'title': job_data.get('title', ''),
                'company': job_data.get('company', ''),
                'location': job_data.get('location', ''),
                'apply_url': job_data.get('apply_url', ''),
                'source': job_data.get('source', ''),
                'description': job_data.get('description', ''),
                'skills': job_data.get('skills', []),
                'salary': job_data.get('salary', ''),
                'tags': job_data.get('tags', []),
            }
        )
        
        # Toggle bookmark
        bookmark, bookmark_created = BookmarkedJob.objects.get_or_create(
            user=request.user,
            job=job
        )
        
        if not bookmark_created:
            bookmark.delete()
            return Response({
                'success': True,
                'is_bookmarked': False,
                'message': 'Bookmark removed'
            })
        
        return Response({
            'success': True,
            'is_bookmarked': True,
            'message': 'Job bookmarked'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job(request):
    """Mark a job as applied"""
    try:
        job_id = request.data.get('job_id')
        job_data = request.data.get('job_data')
        notes = request.data.get('notes', '')
        
        # Get or create job in database
        job, created = Job.objects.get_or_create(
            external_id=job_id,
            defaults={
                'title': job_data.get('title', ''),
                'company': job_data.get('company', ''),
                'location': job_data.get('location', ''),
                'apply_url': job_data.get('apply_url', ''),
                'source': job_data.get('source', ''),
                'description': job_data.get('description', ''),
                'skills': job_data.get('skills', []),
                'salary': job_data.get('salary', ''),
                'tags': job_data.get('tags', []),
            }
        )
        
        # Create or update applied job record
        applied, created = AppliedJob.objects.get_or_create(
            user=request.user,
            job=job,
            defaults={'notes': notes}
        )
        
        if not created:
            applied.notes = notes
            applied.save()
        
        return Response({
            'success': True,
            'is_applied': True,
            'message': 'Job marked as applied'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_applied_jobs(request):
    """Get all jobs user has applied to"""
    try:
        applied_jobs = AppliedJob.objects.filter(user=request.user).select_related('job')
        
        jobs_data = []
        for applied in applied_jobs:
            job = applied.job
            jobs_data.append({
                'id': job.external_id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'apply_url': job.apply_url,
                'source': job.source,
                'description': job.description,
                'skills': job.skills,
                'salary': job.salary,
                'tags': job.tags,
                'status': applied.status,
                'notes': applied.notes,
                'applied_at': applied.applied_at,
                'is_bookmarked': BookmarkedJob.objects.filter(user=request.user, job=job).exists(),
                'is_applied': True,
            })
        
        return Response({
            'success': True,
            'total': len(jobs_data),
            'jobs': jobs_data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_bookmarked_jobs(request):
    """Get all bookmarked jobs"""
    try:
        bookmarked_jobs = BookmarkedJob.objects.filter(user=request.user).select_related('job')
        
        jobs_data = []
        for bookmark in bookmarked_jobs:
            job = bookmark.job
            jobs_data.append({
                'id': job.external_id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'apply_url': job.apply_url,
                'source': job.source,
                'description': job.description,
                'skills': job.skills,
                'salary': job.salary,
                'tags': job.tags,
                'is_bookmarked': True,
                'is_applied': AppliedJob.objects.filter(user=request.user, job=job).exists(),
            })
        
        return Response({
            'success': True,
            'total': len(jobs_data),
            'jobs': jobs_data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_applied_job_status(request):
    """Update the status of an applied job"""
    try:
        job_id = request.data.get('job_id')
        status = request.data.get('status')
        
        applied_job = AppliedJob.objects.get(
            user=request.user,
            job__external_id=job_id
        )
        applied_job.status = status
        applied_job.save()
        
        return Response({
            'success': True,
            'message': 'Status updated'
        })
    except AppliedJob.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Applied job not found'
        }, status=404)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)