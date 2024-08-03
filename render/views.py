import requests

from blog.views import ValidateTokenView
from blog.forms import FroalaBodyForm

from rest_framework.reverse import reverse
from rest_framework.request import Request
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.shortcuts import render, redirect


def login_page(request):
    return render(request, 'auth-sign-in.html')

def test_blog(request,):
    token = request.COOKIES.get('Token', None)
    validate_token_request = Request(request=HttpRequest())
    validate_token_request.data.update({'token': token})
    
    validate_token = ValidateTokenView()
    response = validate_token.post(request=validate_token_request)

    if response.status_code != 200 or not response.data.get("valid", False):
        return redirect(reverse('login_page'))
    
    
    form = FroalaBodyForm()

    context = {
        'form': form,
        'username': response.data.get("username")
    }
    
    return render(request, 'index.html', context=context)
