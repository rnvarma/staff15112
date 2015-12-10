from django.conf.urls import include, url
from django.contrib import admin
from main.views import *

urlpatterns = [
    url(r'^$', HomePageView.as_view()),
    url(r'^autolab$', AutolabView.as_view()),
    url(r'^piazza$', PiazzaView.as_view()),
    url(r'^calendar$', CalendarView.as_view()),
]
