# myapp/urls.py
from django.urls import path
from render.views import login_page, test_blog

urlpatterns = [
    path('login_page/', login_page, name='login_page'),
    path('test_blog/', test_blog, name='test_blog'),
]
