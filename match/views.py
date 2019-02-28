# match/views.py
from django.shortcuts import render
from django.utils.safestring import mark_safe
import json

def wuziqi(request):
    return render(request, 'match/wuziqi.html', {})
def snake(request):
    return render(request,'match/snake.html')
