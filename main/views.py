from django.shortcuts import render
from django.views.generic.base import View
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework.views import APIView
from main.models import *

import json
from dateutil import tz
from datetime import date
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

DAYS = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
}

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

def get_event_data(request, event_obj):
  st = event_obj.start_date
  et = event_obj.end_date

  from_zone = tz.tzutc()
  to_zone = tz.gettz('America/New_York')
  st = st.replace(tzinfo=from_zone)
  st = st.astimezone(to_zone)
  et = et.replace(tzinfo=from_zone)
  et = et.astimezone(to_zone)

  event = event_obj.__dict__
  (yr, m , d, h, minute) = getDateStats(str(st))
  startT = h + float(minute)/60
  start_data = {
      "full": st,
      "scaledT": startT,
      "year": yr,
      "month": m,
      "date": d,
      "time": getTime(h, minute),
      "day": DAYS[st.weekday()]
  }
  (yr, m , d, h, minute) = getDateStats(str(et))
  endT = h + float(minute)/60
  end_data = {
      "full": et,
      "scaledT": endT,
      "year": yr,
      "month": m,
      "date": d,
      "time": getTime(h, minute),
      "day": DAYS[et.weekday()]
  }
  event['start_date'] = start_data
  event['end_date'] = end_data
  event['attendees'] = []
  for ca in event_obj.attendees.all():
    event['attendees'].append(ca.name)
  event['is_volunteering'] = request.user.cadata in list(event_obj.attendees.all())
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
    data = get_event_data(request, new_event)
    return JsonResponse(data)

class EditEventView(View):
  def post(self, request):
    data = json.loads(dict(request.POST).keys()[0])
    event = Event.objects.get(id=int(data["id"]))
    event.name = data["name"]
    event.location = data["location"]
    event.description = data["description"]
    event.start_date = data["start_date"]
    event.end_date = data["end_date"]
    if data["event_type"]:
      event.event_type = data["event_type"]
    event.num_volunteers_needed = int(data["num_volunteers_needed"])
    event.save()
    return JsonResponse({})

class DeleteEventView(View):
  def post(self, request):
    data = json.loads(dict(request.POST).keys()[0])
    event = Event.objects.get(id=int(data["id"]))
    event.delete()
    return JsonResponse({})

class GetEventsView(APIView):
  def get(self, request):
    events = Event.objects.all()
    data = []
    for event in events:
      data.append(get_event_data(request, event))
    return JsonResponse(data, safe=False)

class VolunteerView(View):
  def get(self, request):
    events = Event.objects.filter(num_volunteers_needed__gt=0, start_date__gt=date.today())
    data = []
    for event in events:
      event_data = get_event_data(request, event)
      data.append(event_data)
    return render(request, 'volunteer.html', {"events": data})

class VolunteerSignup(View):
  def post(self, request):
    event_id = int(request.POST.get("event_id"))
    event = Event.objects.get(id=event_id)
    oldLen = event.attendees.count()
    event.attendees.add(request.user.cadata)
    newLen = event.attendees.count()
    if oldLen < newLen:
      event.num_volunteers_needed -= 1
      event.save()
    return HttpResponseRedirect("/volunteering")














