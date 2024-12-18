# Generated by Django 5.0.1 on 2024-11-25 01:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

  initial = True

  dependencies = [
    migrations.swappable_dependency(settings.AUTH_USER_MODEL),
  ]

  operations = [
    migrations.CreateModel(
      name="File",
      fields=[
        (
          "id",
          models.BigAutoField(
            auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
          ),
        ),
        ("file", models.FileField(upload_to="uploads/")),
        ("name", models.CharField(max_length=255)),
        ("uploaded_at", models.DateTimeField(auto_now_add=True)),
        ("is_encrypted", models.BooleanField(default=True)),
        (
          "shared_with",
          models.ManyToManyField(
            blank=True, related_name="shared_files", to=settings.AUTH_USER_MODEL
          ),
        ),
        (
          "uploaded_by",
          models.ForeignKey(
            on_delete=django.db.models.deletion.CASCADE,
            related_name="uploaded_files",
            to=settings.AUTH_USER_MODEL,
          ),
        ),
      ],
      options={
        "ordering": ["-uploaded_at"],
      },
    ),
  ]
