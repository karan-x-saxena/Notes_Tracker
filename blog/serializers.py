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


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ['name']
    
    def to_representation(self, instance):
        return instance.name

class NoteSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    tags = TagSerializer(many=True)
    author = serializers.SlugRelatedField(queryset=NoteTrackerUser.objects.all(), slug_field='username')
    parent_note = serializers.CharField(write_only=True)

    def get_created_at(self, obj):
        return obj.created_at.strftime("%d %b %y")
    
    def get_tags(self, obj):
        return list(obj.tags.all().values_list('name', flat=True))
    
    def create(self, validated_data):
        try:
            tags = validated_data.pop('tags')
            parent_note = validated_data.pop('parent_note')
            instance = super(NoteSerializer, self).create(validated_data=validated_data)

            for tag in tags:
                tag, _ = Tag.objects.get_or_create(name=tag['name'], defaults={'category': 'filter'})
                instance.tags.add(tag)
            
            instance.tags.add(Tag.objects.get(name=instance.author.username))
            
            if parent_note != 'Root':
                parent = Note.objects.get(title=parent_note)
                parent.child_notes.append(instance.id)
                parent.save()
            else: 
                instance.is_head_note = True
                instance.save()

            return instance
        except Exception as e:
            print(e)
            raise serializers.ValidationError({"detail": ["Some error occured please contant admin!"]})


    class Meta:
        model = Note
        fields = ['title', 'slug_heading', 'priority', 'body', 'created_at', 'author', 'tags', 'parent_note']