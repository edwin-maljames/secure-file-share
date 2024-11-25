from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import File
from .serializers import FileSerializer
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import FileResponse
import os

# Create your views here.

class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (parsers.JSONParser, parsers.MultiPartParser, parsers.FormParser)
    
    def get_queryset(self):
        # Return files uploaded by user or shared with user
        return File.objects.filter(
            Q(uploaded_by=self.request.user) |
            Q(shared_with=self.request.user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file_obj = self.get_object()
        file_path = file_obj.file.path
        
        if not os.path.exists(file_path):
            return Response(
                {'error': 'File not found'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        response = FileResponse(
            open(file_path, 'rb'),
            as_attachment=True,
            filename=file_obj.name
        )
        return response
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        file = self.get_object()
        username = request.data.get('username')
        
        if not username:
            return Response(
                {'error': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(username=username)
            if user == request.user:
                return Response(
                    {'error': 'Cannot share with yourself'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            file.shared_with.add(user)
            return Response({'message': f'File shared with {username}'})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def unshare(self, request, pk=None):
        file = self.get_object()
        username = request.data.get('username')
        
        if not username:
            return Response(
                {'error': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(username=username)
            file.shared_with.remove(user)
            return Response({'message': f'File unshared with {username}'})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
