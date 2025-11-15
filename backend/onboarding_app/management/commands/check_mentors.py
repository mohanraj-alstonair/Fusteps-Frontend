from django.core.management.base import BaseCommand
from onboarding_app.models import Mentor, Candidate, ConnectionRequest

class Command(BaseCommand):
    help = 'Check mentor data storage and display statistics'

    def handle(self, *args, **options):
        self.stdout.write("=== Mentor Storage Check ===\n")
        
        # Check mentor count
        mentor_count = Mentor.objects.count()
        self.stdout.write(f"Total Mentors: {mentor_count}")
        
        if mentor_count > 0:
            # Show recent mentors
            recent_mentors = Mentor.objects.order_by('-id')[:5]
            self.stdout.write("\nRecent Mentors:")
            for mentor in recent_mentors:
                self.stdout.write(f"  ID: {mentor.id}")
                self.stdout.write(f"  Name: {mentor.name}")
                self.stdout.write(f"  Email: {mentor.email}")
                self.stdout.write(f"  Company: {mentor.company_name}")
                self.stdout.write(f"  Role: {mentor.mentor_role}")
                self.stdout.write(f"  Experience: {mentor.experience_years} years")
                self.stdout.write(f"  Location: {mentor.location}")
                self.stdout.write("  ---")
            
            # Check for incomplete records
            incomplete = Mentor.objects.filter(
                name__isnull=True
            ) | Mentor.objects.filter(
                name__exact=''
            ) | Mentor.objects.filter(
                email__isnull=True
            ) | Mentor.objects.filter(
                email__exact=''
            )
            
            if incomplete.exists():
                self.stdout.write(f"\nIncomplete Records: {incomplete.count()}")
                for mentor in incomplete:
                    self.stdout.write(f"  ID {mentor.id}: Name='{mentor.name}', Email='{mentor.email}'")
            else:
                self.stdout.write("\nAll mentor records appear complete.")
        
        # Check candidates
        candidate_count = RegisteredCandidate.objects.count()
        self.stdout.write(f"\nTotal Students: {candidate_count}")
        
        # Check connections
        connection_count = ConnectionRequest.objects.count()
        self.stdout.write(f"Total Connection Requests: {connection_count}")
        
        self.stdout.write("\n=== Check Complete ===")