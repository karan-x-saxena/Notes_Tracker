from django.contrib import admin
from blog.models import NoteTrackerUser, Note, Tag
from django.contrib.auth.admin import UserAdmin

@admin.register(NoteTrackerUser)
class NoteTrackerUserAdmin(UserAdmin):
    pass

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug_heading', 'created_at', 'modified_at']

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass