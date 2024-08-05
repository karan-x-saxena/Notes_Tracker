# Generated by Django 5.0.6 on 2024-08-03 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0007_remove_tag_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='priority',
            field=models.CharField(choices=[('highest', 'Highest'), ('high', 'High'), ('medium', 'Medium'), ('low', 'Low'), ('lowest', 'Lowest')], default='medium', max_length=100),
        ),
        migrations.AlterField(
            model_name='tag',
            name='category',
            field=models.CharField(choices=[('user', 'User'), ('filter', 'Filter')], default='filter', max_length=100),
        ),
    ]