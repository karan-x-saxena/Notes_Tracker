# Generated by Django 5.0.6 on 2024-07-15 15:07

import django_quill.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='body',
            field=django_quill.fields.QuillField(blank=True, null=True),
        ),
    ]
