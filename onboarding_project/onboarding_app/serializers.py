from rest_framework import serializers
from .models import ChatMessage, BookedSession

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender_type', 'sender_id', 'receiver_id', 'content', 'message_type', 'status', 'timestamp', 'is_conversation', 'conversation_data', 'ratings', 'feedback', 'mentor_ratings', 'mentor_feedback']
        # Note: Removed fields (is_deleted, file_url, reply_to_id, response, response_date) are no longer in the model

class BookedSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)

    class Meta:
        model = BookedSession
        fields = '__all__'
