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
    url(r'^createevent$', CreateEventView.as_view()),
    url(r'^1/addevent$', AddEventView.as_view()),
    url(r'^1/editevent$', EditEventView.as_view()),
    url(r'^1/deleteevent$', DeleteEventView.as_view()),
    url(r'^1/getevents$', GetEventsView.as_view()),
]
