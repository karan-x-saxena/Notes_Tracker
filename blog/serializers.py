# myapp/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

from blog.models import Note, Tag, NoteTrackerUser

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username', None)
        password = data.get('password', None)
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                data['user'] = user
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')
        return data


class NoteSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    author = serializers.SlugRelatedField(queryset=NoteTrackerUser.objects.all(), slug_field='username')

    def get_created_at(self, obj):
        return obj.created_at.strftime("%d %b %y")
    
    def get_tags(self, obj):
        return list(obj.tags.all().values_list('name', flat=True))

    class Meta:
        model = Note
        fields = ['title', 'slug_heading', 'priority', 'body', 'created_at', 'author', 'tags']