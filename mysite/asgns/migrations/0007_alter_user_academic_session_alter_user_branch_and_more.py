# Generated by Django 5.1 on 2024-10-04 13:37

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0006_assignment_remove_team_user_and_team_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='academic_session',
            field=models.ManyToManyField(null=True, related_name='acad_session_of_user', to='asgns.academic_session'),
        ),
        migrations.AlterField(
            model_name='user',
            name='branch',
            field=models.CharField(choices=[('CSE', 'Computer Science'), ('DSAI', 'Data Science and Artificial Intelligence'), ('MNC', 'Mathematics and Computing'), ('ECE', 'Electronics and Communication'), ('EE', 'Electrical'), ('ME', 'Mechanical'), ('EPH', 'Engineering Physics'), ('CH', 'Chemical'), ('CE', 'Civil'), ('PNI', 'Production and Industrial'), ('MT', 'Metallurgy'), ('BSBE', 'Biosciences and Biotechnology'), ('BSMSCY', 'Chemical Sciences'), ('BSMSPY', 'Physics'), ('GPT', 'Geophysical Technology'), ('GT', 'Geological Technology')], max_length=6, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='enrollment_number',
            field=models.CharField(max_length=8, null=True, validators=[django.core.validators.MinLengthValidator(8), django.core.validators.MaxLengthValidator(8)]),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=30, null=True, unique=True),
        ),
    ]