# api_server.py
from fastapi.routing import APIRouter
from langchain_core.messages import HumanMessage
from Two_way_Chatting.Main.Flow.chat_graph import graph,config
from Two_way_Chatting.Main.Flow.model_config import load_llm
from api.socket_config import sio

router = APIRouter()

session_states = {}

@sio.on("start_stream_answer")
async def websocket_stream(sid, data):
    print("[RECEIVED]", repr(data))  # use repr to catch empty strings

    if not data or not data.strip():
        await sio.emit("stream_chunk", "Please enter a valid message.", to=sid)
        await sio.emit("stream_chunk", "[DONE]", to=sid)
        return

    if sid not in session_states:
        session_states[sid] = {"messages": []}

    session_states[sid]["messages"].append(HumanMessage(content=data))

    try:
        result = await graph.ainvoke(
            session_states[sid],
            config={"configurable": {"thread_id": sid}}
        )
        print("[RESULT]", result)

        # Get AI response and emit
        if "messages" in result and result["messages"]:
            ai_msg = result["messages"][-1]
            print("[AI MSG]", ai_msg)

            session_states[sid]["messages"].append(ai_msg)

            for word in ai_msg.content.split(" "):
                await sio.emit("stream_chunk", word + " ", to=sid)
            await sio.emit("stream_chunk", "[DONE]", to=sid)
        else:
            await sio.emit("stream_chunk", "No response from assistant.", to=sid)
            await sio.emit("stream_chunk", "[DONE]", to=sid)

    except Exception as e:
        print("[GRAPH ERROR]", e)
        await sio.emit("stream_chunk", f"Internal error: {str(e)}", to=sid)
        await sio.emit("stream_chunk", "[DONE]", to=sid)
