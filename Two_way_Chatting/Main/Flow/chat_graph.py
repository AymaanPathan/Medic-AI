from langgraph.graph import StateGraph, END
from Two_way_Chatting.Main.Flow.chat_state import chat_interface_state
from Two_way_Chatting.Main.Flow.model_config import load_llm
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from fastapi import FastAPI
from fastapi.responses import StreamingResponse


app = FastAPI()
memory = MemorySaver()


def chat_With_user(state: chat_interface_state):
    chat_history = state.get("messages", [])
    response = load_llm.invoke(chat_history)
    return Command( 
        update={
            "messages": [AIMessage(content=response.content)]
        }
    )

builder = StateGraph(chat_interface_state)
builder.add_node("chat", chat_With_user)
builder.set_entry_point("chat")
builder.add_edge("chat", END)
graph = builder.compile(checkpointer=memory)

config = {"configurable": {"thread_id": "1"}}
