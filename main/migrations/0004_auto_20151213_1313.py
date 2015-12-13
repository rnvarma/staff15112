# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_auto_20151211_1651'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='creator',
            field=models.ForeignKey(related_name='created_events', blank=True, to='main.CAdata', null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='num_volunteers_needed',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='event',
            name='volunteers_needed',
            field=models.BooleanField(default=False),
        ),
    ]
