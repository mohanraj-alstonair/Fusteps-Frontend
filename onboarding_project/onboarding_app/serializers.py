from rest_framework import serializers
from .models import ChatMessage, BookedSession

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class BookedSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)

    class Meta:
        model = BookedSession
        fields = '__all__'
