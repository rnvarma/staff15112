# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cadata',
            name='recitation',
            field=models.ForeignKey(related_name='leaders', blank=True, to='main.Recitation'),
        ),
    ]
