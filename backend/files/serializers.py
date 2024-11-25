from rest_framework import serializers
from .models import File
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class FileSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    shared_with = UserSerializer(many=True, read_only=True)
    file = serializers.FileField(required=True)
    
    class Meta:
        model = File
        fields = ['id', 'file', 'name', 'uploaded_by', 'uploaded_at', 'is_encrypted', 'shared_with']
        read_only_fields = ['uploaded_by', 'uploaded_at', 'is_encrypted']

    def validate_file(self, value):
        if not value:
            raise serializers.ValidationError("No file was submitted")
        return value
