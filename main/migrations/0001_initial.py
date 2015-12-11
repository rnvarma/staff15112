# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Announcement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField()),
                ('datetime', models.DateTimeField(null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Availability',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monday', models.TextField()),
                ('tuesday', models.TextField()),
                ('wednesday', models.TextField()),
                ('thursday', models.TextField()),
                ('friday', models.TextField()),
                ('saturday', models.TextField()),
                ('sunday', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='CAdata',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('andrewID', models.CharField(max_length=50)),
                ('isCA', models.BooleanField(default=False)),
                ('num_semesters', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('datetime', models.DateTimeField(null=True, blank=True)),
                ('content', models.TextField()),
                ('creator', models.ForeignKey(related_name='comments', to='main.CAdata')),
                ('post', models.ForeignKey(related_name='comments', to='main.Announcement')),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('start_date', models.DateTimeField(null=True, blank=True)),
                ('end_date', models.DateTimeField(null=True, blank=True)),
                ('event_type', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='OfficeHour',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time', models.DateTimeField(null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Recitation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('section', models.CharField(max_length=10)),
                ('time', models.DateTimeField(null=True, blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='cadata',
            name='events',
            field=models.ManyToManyField(related_name='attendees', to='main.Event'),
        ),
        migrations.AddField(
            model_name='cadata',
            name='office_hours',
            field=models.ManyToManyField(related_name='cas', to='main.OfficeHour'),
        ),
        migrations.AddField(
            model_name='cadata',
            name='recitation',
            field=models.ForeignKey(related_name='leaders', to='main.Recitation'),
        ),
        migrations.AddField(
            model_name='cadata',
            name='user',
            field=models.OneToOneField(related_name='cadata', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='availability',
            name='CA',
            field=models.OneToOneField(related_name='availability', to='main.CAdata'),
        ),
        migrations.AddField(
            model_name='announcement',
            name='creator',
            field=models.ForeignKey(related_name='announcements', to='main.CAdata'),
        ),
    ]
