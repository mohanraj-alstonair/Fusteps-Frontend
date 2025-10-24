from django.urls import re_path
from . import consumers
from . import consumers_mentor

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<sender_id>\d+)/(?P<receiver_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/status/(?P<connection_id>\d+)/$', consumers.StatusConsumer.as_asgi()),
    re_path(r'ws/mentor/(?P<mentor_id>\d+)/$', consumers_mentor.MentorConsumer.as_asgi()),
]
