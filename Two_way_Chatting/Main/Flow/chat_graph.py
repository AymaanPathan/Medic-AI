import json
from langgraph.graph import StateGraph, END
from Two_way_Chatting.Main.Flow.chat_state import chat_interface_state
from Two_way_Chatting.Main.Flow.model_config import load_llm
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from Two_way_Chatting.Main.Flow.MessageFilterModel import MessageFilterResponse, parser
from fastapi import FastAPI

# Init
app = FastAPI()
memory = MemorySaver()




def check_user_question_related_to(state: chat_interface_state):
    last_user_message = ""
    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            last_user_message = message.content.strip()
            break

    # If there's no message
    if not last_user_message:
        return {"allowed": False, "reason": "No valid user message found."}

    # Sanitize for prompt injection (optional but safe)
    safe_message = last_user_message.replace('{', '').replace('}', '').replace('\n', ' ').strip()

    system_prompt = f"""
You are a strict message content filter for a medical assistant chatbot.

Your job is to ensure that the user's message is either:
1. Related to **medical symptoms**, medications, diagnosis, health conditions, or
2. Related to the user's **personal medical information** like age, gender, medical history, or current complaints.
3. Related to greetings — this should be allowed because it helps build trust.

Any message that is unrelated (e.g. jokes, general knowledge not related to medicine, random questions like weather, politics, etc.) should be flagged as not allowed.

Analyze the user's message carefully.

Return your answer ONLY in the following JSON format:

{parser.get_format_instructions()}

User Current Message: "{safe_message}"
"""

    try:
        result = load_llm.invoke([
            SystemMessage(content=system_prompt)
        ])
        parsed = parser.parse(result.content)
        return parsed.model_dump()

    except Exception as e:
        return {
            "allowed": False,
            "reason": f"System error while checking message: {str(e)}",
            "raw_response": getattr(result, "content", "N/A")
        }



example_state: chat_interface_state = {
    "messages": [
        HumanMessage(content="i have cough what is elon musk"),
        AIMessage(content="Thanks. Are you currently taking any medicines or have any prior conditions like asthma, diabetes, etc?")
    ],
    "latest_user_message": "I'm 24, and I also feel body aches.",
    "user_info": {
        "name": "Aymaan",
        "age": 24,
        "gender": "male"
    },
    "symptoms": ["fever", "cough", "body aches"],
    "medications_taken": [],
    "medical_history": []
}

res =check_user_question_related_to(example_state)
print(res)
