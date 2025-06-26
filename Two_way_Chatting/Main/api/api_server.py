# api_server.py
from fastapi.routing import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from Two_way_Chatting.Main.Flow.chat_graph import graph,config
from Two_way_Chatting.Main.Flow.model_config import load_llm
from fastapi import  WebSocket
from api.socket_config import sio

router = APIRouter()

# Initialize empty conversation state
state = {"messages": []}



@sio.on("start_stream_answer")
async def websocket_stream(sid, data):
    print("[RECEIVED]", data)

    state["messages"].append(HumanMessage(content=data))
    result = graph.invoke(state, config=config, stream_mode="values")
    state["messages"].append(result["messages"][-1])

    for chunk in load_llm.stream(data):
        await sio.emit("stream_chunk", chunk.content, to=sid)
        print(f"[EMITTED] Chunk: {chunk.content}")


    await sio.emit("stream_chunk", "[DONE]", to=sid)