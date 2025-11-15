from django.contrib import admin
from .models import Candidate, ChatMessage

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'role', 'company_name', 'location']
    search_fields = ['name', 'email', 'expertise', 'company_name']
    list_filter = ['role', 'education_level', 'field_of_study']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['sender_type', 'sender_id', 'receiver_id', 'timestamp']
    list_filter = ['sender_type', 'timestamp']
