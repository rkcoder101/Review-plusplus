# Generated by Django 5.1 on 2024-11-05 11:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0016_alter_user_branch_alter_user_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='branch',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
