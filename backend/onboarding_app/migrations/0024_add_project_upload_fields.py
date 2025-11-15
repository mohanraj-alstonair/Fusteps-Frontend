# Generated migration for project upload fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding_app', '0023_add_mentor_collaboration_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectidea',
            name='project_type',
            field=models.CharField(choices=[('idea', 'Idea'), ('uploaded', 'Uploaded Project'), ('under_review', 'Under Review'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='idea', max_length=20),
        ),
        migrations.AddField(
            model_name='projectidea',
            name='technologies',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='projectidea',
            name='github_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='projectidea',
            name='live_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='projectidea',
            name='additional_notes',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='projectidea',
            name='rating',
            field=models.DecimalField(blank=True, decimal_places=1, max_digits=3, null=True),
        ),
    ]