from django.forms import ModelForm
from django import forms
from blog.models import Note

# Import Froala Editor Widget from froala_editor.widget
from froala_editor.widgets import FroalaEditor


class FroalaBodyForm(ModelForm):
    body = forms.CharField(widget=FroalaEditor)

    class Meta:
        model = Note
        fields = ('body',)

