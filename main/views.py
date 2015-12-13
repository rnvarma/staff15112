from django.shortcuts import render
from django.views.generic.base import View
from django.http import JsonResponse
from rest_framework.views import APIView
from main.models import *

import json
from dateutil import tz
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

def getTime(h, m):
  ampm = "AM" if h < 12 else "PM"
  h = h if h < 13 else h % 12
  if m == 0:
      return "%d:00 %s" % (h, ampm)
  else:
      return "%d:%d %s" % (h, m, ampm)

def getDateStats(dt):
  
  if "T" in dt:
    date, time = dt.split("T")
  else:
    date, time = dt.split(" ")
  time = time.split(".")[0]
  yr, m, d = map(int, date.split("-"))
  h, minute, s = map(int, map(float, time.split(":")))
  return (yr, m , d, h, minute)

def get_event_data(event):
  st = event.start_date
  et = event.end_date

  from_zone = tz.tzutc()
  to_zone = tz.gettz('America/New_York')
  st = st.replace(tzinfo=from_zone)
  st = st.astimezone(to_zone)
  et = et.replace(tzinfo=from_zone)
  et = et.astimezone(to_zone)

  event = event.__dict__
  (yr, m , d, h, minute) = getDateStats(str(st))
  startT = h + float(minute)/60
  start_data = {
      "full": et,
      "scaledT": startT,
      "year": yr,
      "month": m,
      "date": d,
      "time": getTime(h, minute)
  }
  (yr, m , d, h, minute) = getDateStats(str(et))
  endT = h + float(minute)/60
  end_data = {
      "full": et,
      "scaledT": endT,
      "year": yr,
      "month": m,
      "date": d,
      "time": getTime(h, minute)
  }
  event['start_date'] = start_data
  event['end_date'] = end_data
  event.pop('_creator_cache', None)
  event.pop('_state', None)
  return event

class AddEventView(View):
  def post(self, request):
    data = json.loads(dict(request.POST).keys()[0])
    new_event = Event(
                  creator=request.user.cadata,
                  name=data["name"],
                  end_date=data["end_date"]["full"],
                  start_date=data["start_date"]["full"]
                )
    new_event.save()
    id = new_event.id
    new_event = Event.objects.get(id=id)
    data = get_event_data(new_event)
    return JsonResponse(data)

class GetEventsView(APIView):
  def get(self, request):
    events = Event.objects.all()
    data = []
    for event in events:
      data.append(get_event_data(event))
    return JsonResponse(data, safe=False)


