# Generated by Django 5.1 on 2024-12-24 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0041_alter_user_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(default='pbkdf2_sha256$870000$7gJXbJPkFTILG794Cnk8Yu$eP7rq2juTSmUvWXw4tJtkGUrwAuMYX0ZI65+uxUG4+A=', max_length=128),
        ),
    ]