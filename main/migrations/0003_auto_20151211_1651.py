# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20151211_1649'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cadata',
            name='recitation',
            field=models.ForeignKey(related_name='leaders', blank=True, to='main.Recitation', null=True),
        ),
    ]
