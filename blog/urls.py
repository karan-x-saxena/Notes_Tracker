from django.urls import path
from .views import LoginView, ValidateTokenView, NotesView, SubmitView

from rest_framework.authtoken import views

urlpatterns = [
    path('login/',  views.obtain_auth_token),
    path('api/validate_token/', views.obtain_auth_token),
    path('api/notes_title/', NotesView.as_view(), name="test"),
    path('api/submit', SubmitView.as_view(), name="submit")
]
