import json
from langgraph.graph import StateGraph, END
from Two_way_Chatting.Main.Flow.chat_state import chat_interface_state
from Two_way_Chatting.Main.Flow.model_config import load_llm
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from fastapi import FastAPI, logger

# Init
app = FastAPI()
memory = MemorySaver()

import re

def clean_medical_input(user_input: str) -> tuple[str, bool]:
    """
    Classifies segments of the user input and keeps only medical or personal info.
    Returns cleaned message and whether it contained personal info.
    """
    segments = re.split(r"\band\b|[,\.]", user_input.lower())
    segments = [s.strip() for s in segments if s]

    cleaned = []
    found_personal = False

    for segment in segments:
        classification_prompt = f"""
Classify the following as one of:
- "Medical" (symptoms, treatments, diseases)
- "Personal" (name, age, gender)
- "Non-Medical" (history, trivia, general questions)

Segment: "{segment}"

Respond with just one word: Medical / Personal / Non-Medical
"""
        result = load_llm.invoke(classification_prompt).content.strip().lower()

        if result == "medical" or result == "personal":
            cleaned.append(segment)
        if result == "personal":
            found_personal = True

    return ". ".join(cleaned), found_personal


def extract_user_info_with_llm(text: str) -> str:
    prompt = f"""
    Extract the user's name, age, and gender from the following message.

    Respond ONLY in this exact JSON format:
    {{
    "name": string or null,
    "age": int or null,
    "gender": string ("male", "female", "other", or null)
    }}

    User message: "{text}"
    """
    response = load_llm.invoke([HumanMessage(content=prompt)])
    return response.content.strip()

# -------------------- Nodes --------------------


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
        Classify the following user message into one of the following categories:
        - "Medical" (if the message relates to symptoms, diseases, medications, treatments)
        - "Personal" (if the user shares personal information like name, age, gender, habits, or builds rapport)
        - "Irrelevant" (if the message is unrelated to healthcare, e.g., trivia, general knowledge)

        Just return one word: "Medical", "Personal", or "Irrelevant".

        Message: "{user_latest_msg.content}"
    """

    VALID_CATEGORIES = {"medical", "personal", "irrelevant"}

    try:
        result = load_llm.invoke(classification_prompt).content.strip().lower()
    except Exception as e:
        # Log error, route to fallback or end
        logger.error(f"LLM classification failed: {e}")
        return Command(update={"messages": [AIMessage(content="Sorry, something went wrong while processing your input.")]}, goto=END)

    if result not in VALID_CATEGORIES:
        # fallback for undefined results
        logger.warning(f"Unexpected classification output: {result}")
        return Command(update={"messages": [AIMessage(content="Let's focus on health-related concerns. What symptoms are you experiencing?")]}, goto="chat")

    # Deterministic routing
    if result in ("medical", "personal"):
        return Command(update={"classification": result}, goto="continue_medical_flow")
    else:
        return Command(goto="non_medical_response")


# 💊 Node: LLM handles medical response
def continue_medical_flow(state: chat_interface_state):
    user_latest_msg = next((m for m in reversed(state["messages"]) if isinstance(m, HumanMessage)), None)
    user_input = user_latest_msg.content
    filtered_input, has_personal = clean_medical_input(user_input)
    
    if not filtered_input:
        return Command(
            update={"messages": [AIMessage(content="Sorry, I can only help with medical-related topics.")]},
            goto=END
        )
    classification = state.get("classification")

    if has_personal:
        
        try:
            info_json = extract_user_info_with_llm(filtered_input)
            parsed = json.loads(info_json)

            user_info = state.get("user_info", {})
            print("personal" , user_info)
            for k, v in parsed.items():
                if v is not None:
                    user_info[k] = v
            state["user_info"] = user_info

        except Exception as e:
            pass  # don't fail if info parsing fails

    system_prompt = SystemMessage(content=f"You are a strict, safe medical assistant. User info: {state.get('user_info', {})}")
    response = load_llm.invoke([system_prompt, HumanMessage(content=filtered_input)])

    return Command(
        update={"messages": [AIMessage(content=response.content)]},
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


graph = builder.compile(checkpointer=memory)
print("Graph Input Schema Annotations:", graph.input_schema.__annotations__)

config = {"configurable": {"thread_id": "1"}}
