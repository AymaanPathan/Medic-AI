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

# Streaming generator
def stream_model(query: str):
    state["messages"].append(HumanMessage(content=query))
    
    result = graph.invoke(state, config=config, stream_mode="values")
    
    state["messages"].append(result["messages"][-1])

    # Yield content chunks
    for chunk in load_llm.stream(query):
        yield chunk.content

@sio.on("start_stream_answer")
async def websocket_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Wait for message from frontend
            data = await websocket.receive_text()
            print("[RECEIVED]", data)

            # Add human message
            state["messages"].append(HumanMessage(content=data))
            
            # Process with graph (update this logic if needed)
            result = graph.invoke(state, config=config, stream_mode="values")
            state["messages"].append(result["messages"][-1])
            
            # Stream model output
            async for chunk in load_llm.stream(data):
                await websocket.send_text(chunk.content)
                print(f"[EMITTED] Chunk: {chunk.content}")

            await websocket.send_text("[DONE]")  # signal end of message

    except Exception as e:
        print("WebSocket closed:", e)
        await websocket.close()
