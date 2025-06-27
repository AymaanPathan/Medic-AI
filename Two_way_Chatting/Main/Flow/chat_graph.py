from langgraph.graph import StateGraph, END
from Two_way_Chatting.Main.Flow.chat_state import chat_interface_state
from Two_way_Chatting.Main.Flow.model_config import load_llm
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from fastapi import FastAPI

# Init
app = FastAPI()
memory = MemorySaver()

# 🧠 Node: Chat with user
def chat_With_user(state: chat_interface_state):
    return Command(goto="check_user_question")

def check_user_question_related_to(state: chat_interface_state):
    user_latest_msg = next((m for m in reversed(state["messages"]) if isinstance(m, HumanMessage)), None)
    if not user_latest_msg:
        return Command(
            update={"messages": [AIMessage(content="Please enter a message so I can assist you.")]},
            goto=END
        )

    classification_prompt = f"""
    Classify the following user message as either "Medical" or "Non-Medical".
    
    Message: "{user_latest_msg.content}"
    
    Answer with only "Medical" or "Non-Medical".
    """

    result = load_llm.invoke(classification_prompt).content.strip().lower()

    if "medical" in result:
        return Command(goto="continue_medical_flow")
    else:
        return Command(goto="non_medical_response")

# 💊 Node: LLM handles medical response
def continue_medical_flow(state: chat_interface_state):
    user_latest_msg = next((m for m in reversed(state["messages"]) if isinstance(m, HumanMessage)), None)

    
    if user_latest_msg is None:
        return Command(
            update={"messages": [AIMessage(content="Sorry, I didn't get your question. Please try again.")]},
            goto=END
        )
    
    system_prompt = SystemMessage(
        content="You are a strict medical assistant. You **only** answer questions related to health, symptoms, diseases, or medications. If the question is unrelated to medicine, just reply: 'Sorry, I can only help with medical-related topics.'"
    )

    full_prompt = [system_prompt, user_latest_msg]
    response = load_llm.invoke(full_prompt)

    return Command(
        update={
            "messages": [AIMessage(content=response.content)]
        },
        goto="confirm_symptoms_of_user"
    )

# 🚫 Node: Handle non-medical queries
def non_medical_response(state: chat_interface_state):
    return Command(
        update={
            "messages": [AIMessage(content="Sorry, I can only help with medical-related questions like symptoms, diseases, and treatments.")]
        },
        goto=END
    )

builder = StateGraph(chat_interface_state)
builder.add_node("chat", chat_With_user)
builder.set_entry_point("chat")

builder.add_node("check_user_question", check_user_question_related_to)
builder.add_node("continue_medical_flow", continue_medical_flow)
builder.add_node("non_medical_response", non_medical_response)
builder.add_node("confirm_symptoms_of_user", lambda state: Command(goto=END))


# Compile
graph = builder.compile(checkpointer=memory)
print("Graph Input Schema Annotations:", graph.input_schema.__annotations__)

# Config
config = {"configurable": {"thread_id": "1"}}
