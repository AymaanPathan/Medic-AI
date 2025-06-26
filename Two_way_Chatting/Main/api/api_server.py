# api_server.py
from fastapi.routing import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from Two_way_Chatting.Main.Flow.chat_graph import graph,config
from Two_way_Chatting.Main.Flow.model_config import load_llm
from api.socket_config import sio

router = APIRouter()

session_states = {}

@sio.on("start_stream_answer")
async def websocket_stream(sid, data):
    print("[RECEIVED]", data)

    # Initialize state if new user
    if sid not in session_states:
        session_states[sid] = {"messages": []}

    # Append user message
    session_states[sid]["messages"].append(HumanMessage(content=data))

    # Call graph with proper thread_id
    result = await graph.ainvoke(
        session_states[sid],
        config={"configurable": {"thread_id": sid}}
    )

    # Append model response to memory
    session_states[sid]["messages"].append(result["messages"][-1])

    # Stream response word-by-word
    ai_text = result["messages"][-1].content
    for word in ai_text.split(" "):
        await sio.emit("stream_chunk", word + " ", to=sid)
    await sio.emit("stream_chunk", "[DONE]", to=sid)
