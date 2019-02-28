# match/urls.py
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^wuziqi', views.wuziqi, name='index'),
    url(r'^snake', views.snake, name='index')    
]