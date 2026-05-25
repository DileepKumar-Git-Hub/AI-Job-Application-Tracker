from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Resume
from .serializers import ResumeSerializer


class ResumeUploadView(APIView):

    def post(self, request):
        serializer = ResumeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Resume uploaded successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResumeLatestView(APIView):

    def get(self, request):
        resume = Resume.objects.order_by('-uploaded_at').first()
        if not resume:
            return Response(
                {
                    'detail': 'No parsed resume is available yet. Upload one to auto-fill the AI tools.'
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ResumeSerializer(resume)
        return Response(serializer.data, status=status.HTTP_200_OK)