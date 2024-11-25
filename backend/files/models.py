from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class File(models.Model):
    file = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_encrypted = models.BooleanField(default=True)
    shared_with = models.ManyToManyField(User, related_name='shared_files', blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-uploaded_at']
