# Generated by Django 5.1 on 2024-12-20 08:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asgns', '0029_alter_user_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='reviewer',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='reviewer_which_is_pinged', to='asgns.reviewer'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(default='pbkdf2_sha256$870000$OMwFr1P0vcLFI4Pw1ZGwcn$rImzKuS0Ne02vGQM95Y6/+CLvlU2N8dJ25ao1MsqdwM=', max_length=128),
        ),
    ]