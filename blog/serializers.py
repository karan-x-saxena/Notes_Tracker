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
    
    def create_tags(self, tags, instance):
        for tag in tags:
            tag, _ = Tag.objects.get_or_create(name=tag['name'], defaults={'category': 'filter'})
            instance.tags.add(tag)
        
        instance.tags.add(Tag.objects.get(name=instance.author.username))
    
    def save_parent(self, parent_note, id):
        new_parent_note_obj = Note.objects.get(title=parent_note)
        new_parent_note_obj.child_notes.append(id)
        new_parent_note_obj.save()
    
    def add_update_parent(self, parent_note, instance):
        try:
            parent_note_obj = Note.objects.get(child_notes__contains=[instance.pk])

            if parent_note_obj.title != parent_note:
                if parent_note == 'Root':
                    instance.is_head_note = True
                else:
                    self.save_parent(parent_note, instance.id)
                    instance.is_head_note = False

                instance.save()
                parent_note_obj.child_notes.remove(instance.pk)
                parent_note_obj.save()
        
        except Note.DoesNotExist as e:
            if parent_note == 'Root':
                instance.is_head_note = True
            
            else:
                self.save_parent(parent_note, instance.pk)
                instance.is_head_note = False
            
            instance.save()
    
    def create(self, validated_data):
        try:
            tags = validated_data.pop('tags')
            parent_note = validated_data.pop('parent_note')
            instance = super(NoteSerializer, self).create(validated_data=validated_data)

            self.create_tags(tags, instance)
            self.add_update_parent(parent_note, instance)

            return instance
        except Exception as e:
            import traceback
            traceback.print_exc(e)
            raise serializers.ValidationError({"detail": ["Some error occured please contant admin!"]})
    
    def update(self, instance, validated_data):
        try:
            tags = validated_data.pop('tags', None)
            parent_note = validated_data.pop('parent_note', None)
            instance = super(NoteSerializer, self).update(instance=instance, validated_data=validated_data)

            if tags:
                instance.tags.clear()
                self.create_tags(tags, instance)
            
            if parent_note: self.add_update_parent(parent_note, instance)

            return instance
        except Exception as e:
            import traceback
            traceback.print_exc(e)
            raise serializers.ValidationError({"detail": [f"Some error occured please contant admin! - {e}"]})

    class Meta:
        model = Note
        fields = ['title', 'slug_heading', 'priority', 'body', 'created_at', 'author', 'tags', 'parent_note', 'pin_note']