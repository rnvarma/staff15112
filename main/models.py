from django.db import models
from django.conf import settings

# Create your models here.

class Recitation(models.Model):
  section = models.CharField(max_length=10)
  time = models.DateTimeField(blank=True, null=True)

class OfficeHour(models.Model):
  time = models.DateTimeField(blank=True, null=True)

class Event(models.Model):
  name = models.CharField(max_length=100)
  description = models.TextField()
  start_date = models.DateTimeField(blank=True, null=True)
  end_date = models.DateTimeField(blank=True, null=True)
  event_type = models.CharField(max_length=100)
  volunteers_needed = models.BooleanField(default=False)
  num_volunteers_needed = models.IntegerField(default=0)

class CAdata(models.Model):
  user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="cadata")
  name = models.CharField(max_length=50)
  andrewID = models.CharField(max_length=50)
  isCA = models.BooleanField(default=False)
  recitation = models.ForeignKey(Recitation, null=True, blank=True, related_name="leaders")
  events = models.ManyToManyField(Event, related_name="attendees")
  office_hours = models.ManyToManyField(OfficeHour, related_name="cas")
  num_semesters = models.IntegerField(default=0)

class Availability(models.Model):
  monday = models.TextField()
  tuesday = models.TextField()
  wednesday = models.TextField()
  thursday = models.TextField()
  friday = models.TextField()
  saturday = models.TextField()
  sunday = models.TextField()
  CA = models.OneToOneField(CAdata, related_name="availability")

class Announcement(models.Model):
  title = models.CharField(max_length=200)
  content = models.TextField()
  datetime = models.DateTimeField(blank=True, null=True)
  creator = models.ForeignKey(CAdata, related_name="announcements")

class Comments(models.Model):
  post = models.ForeignKey(Announcement, related_name="comments")
  creator = models.ForeignKey(CAdata, related_name="comments")
  datetime = models.DateTimeField(blank=True, null=True)
  content = models.TextField()

