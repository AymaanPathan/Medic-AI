import socketio

allowed_origins = ["http://localhost:5174", "http://localhost:5173"]

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=allowed_origins
)
