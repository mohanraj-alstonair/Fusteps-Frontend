import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Candidate

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Check if this is a global connection or user-specific
        self.user_id = self.scope['url_route']['kwargs'].get('user_id')
        
        # Join global notifications group
        await self.channel_layer.group_add(
            'global_notifications',
            self.channel_name
        )
        await self.accept()
        print(f"NotificationConsumer connected for user {self.user_id or 'global'}")

    async def disconnect(self, close_code):
        # Leave notification group
        await self.channel_layer.group_discard(
            'global_notifications',
            self.channel_name
        )

    async def receive(self, text_data):
        # Handle any client messages if needed
        pass

    # Receive broadcast notification
    async def broadcast_notification(self, event):
        print(f"📨 Notification consumer {self.user_id}: receiver={event['receiver_id']}")
        # For global connections, send to all. For user-specific, filter by receiver
        if self.user_id is None or str(event['receiver_id']) == str(self.user_id):
            print(f"✅ SENDING notification to user {self.user_id or 'global'}: {event['content']}")
            await self.send(text_data=json.dumps({
                'type': 'message_notification',
                'sender_id': event['sender_id'],
                'sender_name': event['sender_name'],
                'sender_type': event['sender_type'],
                'content': event['content'],
                'timestamp': event['timestamp'],
                'receiver_id': event['receiver_id']
            }))
        else:
            print(f"❌ SKIPPING notification for user {self.user_id} (not receiver)")

    @database_sync_to_async
    def get_user_name(self, user_id):
        try:
            user = Candidate.objects.get(id=user_id)
            return user.full_name or user.name or f"User {user_id}"
        except Candidate.DoesNotExist:
            return f"User {user_id}"