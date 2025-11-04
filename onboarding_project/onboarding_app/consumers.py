import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Candidate, ChatMessage
from .serializers import ChatMessageSerializer
from django.utils import timezone

class ChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        # Create a consistent room name regardless of who connects first
        room_ids = sorted([self.sender_id, self.receiver_id])
        self.room_group_name = f'chat_{room_ids[0]}_{room_ids[1]}'
        self.active_users = set()  # Track active users in this chat

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        # Handle regular messages
        content = text_data_json['content']
        sender_type = text_data_json['sender_type']
        sender_id = str(text_data_json['sender_id'])
        receiver_id = str(text_data_json['receiver_id'])

        # Save message to both individual table and conversation
        message_data = await self.save_message(content, sender_type, sender_id, receiver_id)
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_data,
                'sender_id': sender_id,
                'receiver_id': receiver_id
            }
        )
        
        # Send notification to all users (they'll filter on frontend)
        sender_name = await self.get_user_name(sender_id)
        print(f"🔔 Sending notification: {sender_name} -> {receiver_id}")
        await self.channel_layer.group_send(
            'global_notifications',
            {
                'type': 'broadcast_notification',
                'sender_id': sender_id,
                'sender_name': sender_name,
                'sender_type': sender_type,
                'content': f"You have a new message from {sender_name}",
                'timestamp': message_data['timestamp'],
                'receiver_id': receiver_id
            }
        )

    async def chat_message(self, event):
        message = event['message']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': message,
            'sender_id': event.get('sender_id'),
            'receiver_id': event.get('receiver_id')
        }))
        


    @database_sync_to_async
    def save_message(self, content, sender_type, sender_id, receiver_id):
        from django.utils import timezone
        
        # Determine student and mentor IDs for consistent conversation lookup
        if sender_type == 'student':
            student_id, mentor_id = sender_id, receiver_id
        else:
            student_id, mentor_id = receiver_id, sender_id
        
        # Find or create conversation record (always use student as sender for consistency)
        conversation_record = ChatMessage.objects.filter(
            sender_id=student_id,
            receiver_id=mentor_id,
            sender_type='student',
            is_conversation=True
        ).first()
        
        if not conversation_record:
            conversation_record = ChatMessage.objects.create(
                sender_type='student',
                sender_id=student_id,
                receiver_id=mentor_id,
                content='Conversation started',
                is_conversation=True,
                conversation_data=[]
            )
        
        # Create message object for JSON storage (no individual records)
        new_message = {
            'id': len(conversation_record.conversation_data) + 1,
            'sender_type': sender_type,
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'content': content,
            'timestamp': timezone.now().isoformat(),
            'status': 'sent'
        }
        
        # Add message to conversation JSON
        conversation_record.conversation_data.append(new_message)
        conversation_record.timestamp = timezone.now()  # Update last activity
        conversation_record.save()
        
        return new_message

    @database_sync_to_async
    def get_user_name(self, user_id):
        try:
            user = Candidate.objects.get(id=user_id)
            name = user.full_name or user.name or f"User {user_id}"
            print(f"Found user {user_id}: {name}")
            return name
        except Candidate.DoesNotExist:
            print(f"User {user_id} not found")
            return f"User {user_id}"


class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.connection_id = self.scope['url_route']['kwargs']['connection_id']
        self.room_group_name = f'status_{self.connection_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # For status updates, perhaps not needed, but can send updates
        pass

    async def status_update(self, event):
        status_data = event['status_data']

        # Send status update to WebSocket
        await self.send(text_data=json.dumps({
            'status_update': status_data
        }))


