from django.shortcuts import render
from django.views.generic.base import View

from main.models import *
# Create your views here.

CAS = ["angogate","youngjeh","yuzhes","arajgarh",
       "angelali", "akalaba","acong","rouhuil",
       "armanh","aslao","rkern","rkstokes","poyuy",
       "bbakerma","cwurman","cwz","moqings","edryer",
       "graceg","xinhez","imehra","jasonm2","jstapins",
       "jkorn","kevinzhe","kkleiven","lbp","nle",
       "mdwagner","nawilson","nchatter","oweiss",
       "rjadvani","rnvarma","rmorina","sbhartiy",
       "sbien","sbensal","sgakhar","xunliu","tstentz",
       "yeukyul","ycong","zexiy"]

class HomePageView(View):
  def get(self, request):
    u = request.user
    try:
      u.cadata
    except:
      cadata = CAdata(user=u, name=u.first_name + " " + u.last_name,
                      andrewID=u.username, isCA=(u.username in CAS))
      cadata.save()
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

class LoginView(View):
  def get(self, request):
    return render(request, 'login.html')

class CreateEventView(View):
  def get(self, request):
    return render(request, 'createevent.html')






