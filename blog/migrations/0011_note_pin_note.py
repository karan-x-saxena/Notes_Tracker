# Generated by Django 5.0.6 on 2024-08-10 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0010_note_disabled'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='pin_note',
            field=models.BooleanField(default=False),
        ),
    ]
