# api_server.py
import asyncio
import logging
from fastapi.routing import APIRouter
from langchain_core.messages import HumanMessage
from Backend.chat.Two_way_Chatting.Main.Flow.chat_graph import enhanced_graph
from Backend.socket_config import sio
from Backend.tables.chat_messages_table import chat_messages
from Backend.tables.chat_thread_table import chat_thread
from Backend.utils.engine import engine
router = APIRouter()
from datetime import datetime

logger = logging.getLogger("uvicorn.error")
session_states = {}
default_user_info = {
    "name": "Anonymous",
    "age": 0,
    "gender": "unknown"
}

@sio.on("start_status")
async def create_new_thread(sid,data):
    with engine.connect() as conn:
        result = conn.execute(
            chat_thread.insert()
            .values(user="aymaan", created_at=datetime.now())
            .returning(chat_thread.c.id)
        )
        conn.commit()
        thread_id = result.scalar()

    # Store in session
    if sid not in session_states:
        session_states[sid] = default_user_info.copy()
    session_states[sid]["thread_id"] = thread_id
 
    await sio.emit("thread_created", {"thread_id": thread_id}, to=sid)


# WebSocket streaming handler
@sio.on("start_stream_answer")
async def websocket_stream(sid, data):
    """
    WebSocket streaming handler for real-time medical chat
    Expects: data = { "thread_id": int, "message": str }
    """
    logger.info(f"[RECEIVED] from {sid}: {repr(data)}")

    # ✅ Extract thread_id and message from incoming data
    thread_id = data.get("thread_id")
    message = data.get("message")

    # 🔐 Validate input
    if not message or not str(message).strip() or not thread_id:
        await sio.emit("stream_chunk", "⚠️ Please send both thread_id and message.", to=sid)
        await sio.emit("stream_chunk", "[DONE]", to=sid)
        return

    try:
        # ✅ Ensure session state exists
        if sid not in session_states:
            session_states[sid] = {
                "messages": [],
                "latest_user_message": "",
                "user_info": default_user_info.copy(),
                "symptoms": [],
                "medications_taken": [],
                "medical_history": []
            }

        # ✅ Store message in memory (for LLM flow)
        session_states[sid]["messages"].append(HumanMessage(content=message))
        session_states[sid]["latest_user_message"] = message
        if not session_states[sid].get("userSymptoms"):
            session_states[sid]["symptoms_input"] = message
        
        

        # ✅ Save user message to DB
        with engine.connect() as connection:
            connection.execute(
                chat_messages.insert().values(
                    thread_id=thread_id,
                    sender="User",
                    message=message,
                    time_stamp=datetime.now()
                )
            )
            connection.commit()

            result = connection.execute(
                chat_messages.select()
                .where(
                    (chat_messages.c.thread_id == thread_id) &
                    (chat_messages.c.sender == "User")
                )
                .order_by(chat_messages.c.time_stamp.asc())
            )
            user_messages = result.fetchall()

            if len(user_messages) == 1:
                await sio.emit("trigger_sidebar_fetch", {"thread_id": thread_id}, to=sid)

            # ✅ Process via LangGraph
            result = await enhanced_graph.ainvoke(
                session_states[sid],
                config={"configurable": {"thread_id": thread_id}}
            )

        

        logger.info(f"[RESULT] for {sid}: Processing completed")

        # ✅ Extract AI reply
        if "messages" in result and result["messages"]:
            ai_msg = result["messages"][-1]
            response_text = ai_msg.content.strip()
            logger.info(f"[AI MSG] for {sid}: {response_text}")

            # ✅ Update memory
            session_states[sid] = result

            # ✅ Emit streamed chunks
            words = response_text.split(" ")
            full_answer = ""
            for i, word in enumerate(words):
                await sio.emit("stream_chunk", word if i == len(words) - 1 else word + " ", to=sid)
                full_answer += word + " "
                await asyncio.sleep(0.05)

            # ✅ Save AI message to DB
            with engine.connect() as connection:
                connection.execute(
                    chat_messages.insert().values(
                        thread_id=thread_id,
                        sender="A.I",
                        message=full_answer.strip(),
                        time_stamp=datetime.now()
                    )
                )
                connection.commit()

            # ✅ Finish
            await sio.emit("stream_chunk", "[DONE]", to=sid)

            # ✅ Send extracted info
            await sio.emit("medical_info_update", {
                "symptoms": result.get("symptoms", []),
                "medications": result.get("medications_taken", []),
                "medical_history": result.get("medical_history", []),
                "user_info": result.get("user_info", {})
            }, to=sid)

        else:
            await sio.emit("stream_chunk", "⚠️ Sorry, I couldn't generate a reply. Try again.", to=sid)
            await sio.emit("stream_chunk", "[DONE]", to=sid)

    except Exception as e:
        logger.error(f"[GRAPH ERROR] for {sid}: {str(e)}")
        await sio.emit("stream_chunk", "🚨 Server error. Please try again.", to=sid)
        await sio.emit("stream_chunk", "[DONE]", to=sid)

# Additional WebSocket events
@sio.on("connect")
async def connect(sid, environ):
    """
    Handle client connection
    """
    logger.info(f"[CONNECT] Client {sid} connected")
    await sio.emit("welcome", {
        "message": "Welcome! I'm Dr. Sarah, your medical assistant. How can I help you today?",
        "session_id": sid
    }, to=sid)

@sio.on("disconnect")
async def disconnect(sid):
    """
    Handle client disconnection and cleanup
    """
    logger.info(f"[DISCONNECT] Client {sid} disconnected")
    # Clean up session state
    if sid in session_states:
        del session_states[sid]

@sio.on("get_medical_summary")
async def get_medical_summary(sid):
    """
    Get current medical summary for the session
    """
    if sid in session_states:
        state = session_states[sid]
        summary = {
            "symptoms": state.get("symptoms", []),
            "medications": state.get("medications_taken", []),
            "medical_history": state.get("medical_history", []),
            "user_info": state.get("user_info", {}),
            "message_count": len(state.get("messages", []))
        }
        await sio.emit("medical_summary", summary, to=sid)
    else:
        await sio.emit("medical_summary", {
            "error": "No session found"
        }, to=sid)

@sio.on("clear_session")
async def clear_session(sid):
    """
    Clear session data
    """
    if sid in session_states:
        session_states[sid] = {
            "messages": [],
            "latest_user_message": "",
            "user_info": default_user_info.copy(),
            "symptoms": [],
            "medications_taken": [],
            "medical_history": []
        }
        await sio.emit("session_cleared", {"status": "success"}, to=sid)
