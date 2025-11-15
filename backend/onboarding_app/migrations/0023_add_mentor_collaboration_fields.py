# Generated manually for mentor collaboration fields

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding_app', '0022_remove_candidate_difficulty_level_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectidea',
            name='assigned_mentor',
            field=models.ForeignKey(blank=True, limit_choices_to={'role': 'mentor'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_projects', to='onboarding_app.candidate'),
        ),
        migrations.AddField(
            model_name='projectidea',
            name='literature_review_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='projectidea',
            name='prototype_demo_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='projectidea',
            name='mentor_review_notes',
            field=models.TextField(blank=True),
        ),
    ]