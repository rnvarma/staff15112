from django.shortcuts import render
from django.views.generic.base import View

# Create your views here.

class HomePageView(View):
  def get(self, request):
    return render(request, 'homepage.html')

class AutolabView(View):
  def get(self, request):
    return render(request, 'autolab.html')

class PiazzaView(View):
  def get(self, request):
    return render(request, 'piazza.html')

class CalendarView(View):
  def get(self, request):
    return render(request, 'calendar.html')

