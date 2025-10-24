import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MentorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.mentor_id = self.scope['url_route']['kwargs']['mentor_id']
        self.room_group_name = f'mentor_{self.mentor_id}'

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

    async def new_request(self, event):
        new_request_data = event['request_data']

        # Send new request notification to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'new_request',
            'request': new_request_data
        }))
