# myapp/views.py
import json

from django.http import HttpResponseRedirect
from typing import Any
from rest_framework import status, authentication, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from blog.models import Note, NoteTrackerUser, Tag
from .serializers import LoginSerializer, NoteSerializer
from rest_framework.authtoken.models import Token


class ValidateTokenView(APIView):

    def post(self, request, *args, **kwargs):
        token_key = request.data.get('token')
        valid, username = False, ''

        try:
            token_obj = Token.objects.get(key=token_key)
            valid = True
            username = token_obj.user.username
        except Token.DoesNotExist:
            pass

        return Response({'valid': valid, 'username': username})
        

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = LoginSerializer(data=request.data)
        print("reached")
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class NotesView(generics.ListCreateAPIView):
    # authentication_classes = (authentication.TokenAuthentication,)
    # permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NoteSerializer

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        title = self.request.query_params.get('title', None)
        queryset = Note.objects.none()

        if not title:
            queryset = Note.objects.filter(author__username=username, is_head_note=True)
        
        else:
            try:
                parent_note = Note.objects.get(title=title)

            except Note.DoesNotExist as e:
                pass

            else:
                queryset = Note.objects.filter(id__in=parent_note.child_notes)

        return queryset


class SubmitView(APIView):

    def post(self, request):
        #print(request.data)
        # context = json.dumps(dict(request.data))
        # return  HttpResponseRedirect(redirect_to=f'/test_blog/?context={context}')
        head = request.data.get('parent_folder')
        is_head_note = False

        if head == 'root':
            is_head_note = True
        
        author = NoteTrackerUser.objects.get(username=request.data['author'])
        tags = Tag.objects.get(name='access')
        note = Note(title=request.data['title'], slug_heading=request.data['slug_heading'], author=author, body=request.data['body'], is_head_note=is_head_note)
        note.save()
        note.tags.add(tags)
        if not is_head_note: 
            parent_note = Note.objects.get(title=head)
            parent_note.child_notes.append(note.id)
            parent_note.save()
        return HttpResponseRedirect(redirect_to='/test_blog')
    
