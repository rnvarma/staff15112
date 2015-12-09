from django.conf.urls import include, url
from django.contrib import admin
from main.views import *

urlpatterns = [
    url(r'^$', HomePageView.as_view(  )),
]
