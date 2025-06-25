from langgraph.graph import StateGraph, END
from chat_state import chat_interface_state
from model_config import load_llm
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

memory = MemorySaver()

# Node 1 to start convo
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

# Start empty or with a greeting
state: chat_interface_state = {
    "messages": []
}

# Chat loop
while True:
    user_input = input("ask Ai: ")
    if user_input.lower() == "q":
        break

    state["messages"].append(HumanMessage(content=user_input))

    result = graph.invoke(state, config=config)

    ai_reply = result["messages"][-1]
    print(ai_reply.content)

    state["messages"].append(ai_reply)
