import socketio

allowed_origins = ["http://localhost:3001", "http://localhost:3000"]

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=allowed_origins
)
