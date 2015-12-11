from django.conf.urls import include, url
from django.contrib import admin
from main.views import *
from django.contrib.auth.decorators import login_required

urlpatterns = [
    url(r'^$', login_required(HomePageView.as_view())),
    url(r'^autolab$', AutolabView.as_view()),
    url(r'^piazza$', PiazzaView.as_view()),
    url(r'^calendar$', CalendarView.as_view()),
    url(r'^login$', LoginView.as_view()),
]
