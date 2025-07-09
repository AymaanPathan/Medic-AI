# api_server.py
import asyncio
import logging
from fastapi.routing import APIRouter
from langchain_core.messages import HumanMessage
from chat.Two_way_Chatting.Main.Flow.chat_graph import graph
from Backend.socket_config import sio

router = APIRouter()

logger = logging.getLogger("uvicorn.error")
session_states = {}
default_user_info = {
    "name": "Anonymous",
    "age": 0,
    "gender": "unknown"
}

# WebSocket streaming handler
@sio.on("start_stream_answer")
async def websocket_stream(sid, data):
    """
    WebSocket streaming handler for real-time medical chat
    """
    logger.info(f"[RECEIVED] from {sid}: {repr(data)}")

    # Validate input
    if not data or not data.strip():
        await sio.emit("stream_chunk", "Please enter a valid message.", to=sid)
        await sio.emit("stream_chunk", "[DONE]", to=sid)
        return

    try:
        # Initialize session state if not exists
        if sid not in session_states:
            session_states[sid] = {
                "messages": [],
                "latest_user_message": "",
                "user_info": default_user_info.copy(),
                "symptoms": [],
                "medications_taken": [],
                "medical_history": []
            }

        # Add user message to session
        session_states[sid]["messages"].append(HumanMessage(content=data))
        session_states[sid]["latest_user_message"] = data

        # Process through medical chat graph
        result = await graph.ainvoke(
            session_states[sid],
            config={"configurable": {"thread_id": sid}}
        )
        
        logger.info(f"[RESULT] for {sid}: Processing completed")

        # Extract AI response
        if "messages" in result and result["messages"]:
            ai_msg = result["messages"][-1]
            logger.info(f"[AI MSG] for {sid}: Response ready")

            # Update session state
            session_states[sid] = result
            
            # Stream response word by word
            response_text = ai_msg.content
            words = response_text.split(" ")
            
            for i, word in enumerate(words):
                if i == len(words) - 1:
                    await sio.emit("stream_chunk", word, to=sid)
                else:
                    await sio.emit("stream_chunk", word + " ", to=sid)
                
                # Small delay for streaming effect
                await asyncio.sleep(0.05)
            
            # Signal completion
            await sio.emit("stream_chunk", "[DONE]", to=sid)
            
            # Send extracted medical information
            await sio.emit("medical_info_update", {
                "symptoms": result.get("symptoms", []),
                "medications": result.get("medications_taken", []),
                "medical_history": result.get("medical_history", []),
                "user_info": result.get("user_info", {})
            }, to=sid)
            
        else:
            await sio.emit("stream_chunk", "I apologize, but I couldn't generate a response. Please try again.", to=sid)
            await sio.emit("stream_chunk", "[DONE]", to=sid)

    except Exception as e:
        logger.error(f"[GRAPH ERROR] for {sid}: {str(e)}")
        await sio.emit("stream_chunk", "I'm experiencing technical difficulties. Please try again.", to=sid)
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
