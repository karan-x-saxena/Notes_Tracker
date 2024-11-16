from django.contrib.auth.models import AbstractUser, UserManager
from django.contrib.postgres.fields import ArrayField
from django.db import models
from froala_editor.fields import FroalaField

PRIORITY_CHOICES = [('highest', 'Highest'), ('high', 'High'), ('medium', 'Medium'), 
            ('low', 'Low'), ('lowest', 'Lowest')]

CATEGORY_CHOICES = [('user', 'User'), ('filter', 'Filter')]


class NoteTrackerUser(AbstractUser):
    def save(self, *args, **kwargs):
        pk = self.pk
        super(NoteTrackerUser, self).save(*args, **kwargs)

        if not pk:
            access_tag = Tag(name=self.username, category='user')
            access_tag.save()


class Tag(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='filter')


class Note(models.Model):
    title = models.CharField(max_length=400, blank=False, unique=True, null=False)
    slug_heading = models.CharField(max_length=500, blank=True)
    priority = models.CharField(max_length=100, choices=PRIORITY_CHOICES, default='medium')
    body = FroalaField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(NoteTrackerUser, on_delete=models.CASCADE, related_name='notes')
    tags = models.ManyToManyField(Tag, related_name='notes')
    disabled = models.BooleanField(default=False)
    is_head_note = models.BooleanField(default=False)
    pin_note = models.BooleanField(default=False)
    child_notes = ArrayField(models.PositiveIntegerField(), default=[], blank=True)
# Create your models here.
