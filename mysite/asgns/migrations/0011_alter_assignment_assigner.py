# Generated by Django 5.1 on 2024-10-04 19:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0010_alter_assignment_asgn_allocated_to_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='assigner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='asgns.reviewer'),
        ),
    ]