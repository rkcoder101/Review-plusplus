# Generated by Django 5.1 on 2024-12-20 05:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0028_assignment_allocated_to_is_completed_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(default='pbkdf2_sha256$870000$c7yhzj7uI6k7YwCVMZo41v$tHKuAKxTXIIv4n/mT9utuUNHVmaH7kFtkOx7f12Fpn0=', max_length=128),
        ),
    ]