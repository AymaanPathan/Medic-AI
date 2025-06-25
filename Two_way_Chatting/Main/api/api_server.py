# api_server.py
from fastapi import FastAPI
from fastapi.routing import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
from Two_way_Chatting.Main.Flow.chat_graph import graph,config
from Two_way_Chatting.Main.Flow.model_config import load_llm

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

@router.get("/stream_answer")
async def stream_router(query: str = "hi"):
    return StreamingResponse(
        stream_model(query),
        media_type="text/plain"
    )
