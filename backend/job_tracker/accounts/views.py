from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow anyone to create an account


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        response = {
            'status': 'request was permitted',
        }
        return Response(response)