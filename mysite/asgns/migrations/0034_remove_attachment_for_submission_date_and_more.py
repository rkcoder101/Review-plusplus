# Generated by Django 5.1 on 2024-12-21 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0033_alter_user_password'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attachment_for_submission',
            name='date',
        ),
        migrations.RemoveField(
            model_name='attachment_for_submission',
            name='image',
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(default='pbkdf2_sha256$870000$V8wnG3ghitJyvudZ0ftUkq$5RDoF+yqfGZFo9CtllmJWKU7wVb7uIy2oj6x8C2udM8=', max_length=128),
        ),
    ]
