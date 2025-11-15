from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding_app', '0018_add_project_idea_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectIdea',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('estimated_time', models.CharField(blank=True, max_length=100)),
                ('difficulty_level', models.CharField(choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')], default='Intermediate', max_length=50)),
                ('skills_involved', models.TextField(blank=True)),
                ('category', models.CharField(choices=[('Web Development', 'Web Development'), ('Mobile Development', 'Mobile Development'), ('Backend Development', 'Backend Development'), ('AI/ML', 'AI/ML'), ('Data Science', 'Data Science'), ('Game Development', 'Game Development'), ('Other', 'Other')], default='Web Development', max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('student', models.ForeignKey(limit_choices_to={'role': 'student'}, on_delete=django.db.models.deletion.CASCADE, related_name='project_ideas', to='onboarding_app.candidate')),
            ],
            options={
                'db_table': 'project_ideas',
                'ordering': ['-created_at'],
            },
        ),
    ]