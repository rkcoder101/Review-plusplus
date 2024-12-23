# Generated by Django 5.1 on 2024-10-04 19:31

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0009_remove_team_user_team_members'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='asgn_allocated_to',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=30), null=True, size=None),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='date_of_assigning',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='due_date',
            field=models.DateField(null=True),
        ),
    ]
