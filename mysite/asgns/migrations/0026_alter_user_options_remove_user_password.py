# Generated by Django 5.1 on 2024-12-18 14:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0025_remove_assignment_allocated_to_teams_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={},
        ),
        migrations.RemoveField(
            model_name='user',
            name='password',
        ),
    ]
