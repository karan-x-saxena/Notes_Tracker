# Generated by Django 5.0.6 on 2024-07-27 20:33

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_alter_note_child_notes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='child_notes',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.PositiveIntegerField(), blank=True, default=[], size=None),
        ),
    ]
