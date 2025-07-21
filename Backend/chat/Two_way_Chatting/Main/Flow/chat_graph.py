import json
import logging
import re
from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from Backend.chat.Two_way_Chatting.Main.Flow.chat_state import chat_interface_state
from Backend.chat.Two_way_Chatting.Main.Flow.model_config import load_llm
from Backend.chat.Two_way_Chatting.Main.Flow.MessageFilterModel import parser

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="Medical Chat Assistant", version="1.0.0")
memory = MemorySaver()

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    thread_id: str
    user_info: Dict[str, Any] = {}

class ChatResponse(BaseModel):
    response: str
    is_allowed: bool
    thread_id: str
    extracted_info: Dict[str, Any] = {}


def extract_pii(user_message: str):
    name = None
    age = None

    # Extract name from informal intros
    name_match = re.search(r"\b(i am|i'm|im|this is|me|my name is)\s+([a-zA-Z]{2,})", user_message, re.IGNORECASE)
    if name_match:
        name = name_match.group(2).strip()

    # Extract age (1–120) with or without suffix like y, yrs, etc.
    age_match = re.search(r"\b([1-9][0-9]?)\s*(y|yr|yrs|years)?\b", user_message, re.IGNORECASE)
    if age_match:
        age = int(age_match.group(1).strip())

    return {"name": name, "age": age}

def validate_medical_content(state: chat_interface_state) -> Dict[str, Any]:
    """
    Strict medical content and personal info validator using LLM with hint injection and error handling.
    """
    last_user_message = ""
    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            last_user_message = message.content.strip()
            break

    if not last_user_message:
        return {"allowed": False, "reason": "No valid user message found."}

    safe_message = (last_user_message
                    .replace('{', '').replace('}', '')
                    .replace('\n', ' ').replace('\r', '')
                    .strip()[:500])

    # Extract name and age using regex
    pii = extract_pii(safe_message)

    # Store in memory (optional)
    if "user_info" in state:
        state["user_info"].update({k: v for k, v in pii.items() if v})

    # Build HINTS section
    hints = ""
    if pii["name"] or pii["age"]:
        hints += "\n# Detected Personal Info:\n"
        if pii["name"]:
            hints += f"- Name: {pii['name']}\n"
        if pii["age"]:
            hints += f"- Age: {pii['age']}\n"

    # Final system prompt
    system_prompt = f"""
    You are a strict **medical content classifier** used in a real healthcare system. Your job is to classify whether a user's message is medically relevant or not and determine if it contains **personal identifiable information (PII)** like name, age, gender, contact details, etc.

    ### HINTS (from preprocessing):
    {hints if hints else "- None"}

    ### MEDICAL CONTENT POLICY:
    **ALLOWED MEDICAL CONTENT includes:**
    - Health symptoms (e.g., fever, pain, cough, fatigue, rashes)
    - Medication or prescription questions
    - Personal medical history
    - Age, gender, and other medical context
    - Greetings that relate to health (e.g., "Hi, I'm 22 and feeling dizzy")
    - Questions about the user's previously shared health data
    - Sharing personal info that helps with diagnosis (e.g., age, gender, name)
    - Clarifications or corrections to name/age/gender (e.g., "I'm 21, not 22")
    - Memory-based personal questions (e.g., "Do you remember my name?", "What age did I say?")

    **DISALLOWED CONTENT includes:**
    - Non-medical chatting (e.g., "How's your day?", "Tell me a joke")
    - Topics like politics, sports, entertainment, trivia
    - Anything unrelated to health or diagnosis

    ### ADDITIONAL INSTRUCTION:

    If the user provides **personal information** such as name or age, classify the message as `allowed` but also **set the field `"contains_pii": true`** and include a **trustworthy, privacy-conscious message** in `"reason"` like:

    > "Personal info (e.g., name/age) detected. We'll keep this secure and use it only to improve your health support."

    ---

    **Now read this message and return valid JSON in the exact format below. DO NOT write any explanation or extra text.**

    Expected Format:
    {parser.get_format_instructions()}

    User Message:
    \"\"\"{safe_message}\"\"\"
    """

    try:
        result = load_llm.invoke([SystemMessage(content=system_prompt)])
        parsed = parser.parse(result.content)

        logger.info(f"Content validation: {parsed.model_dump()}")
        return parsed.model_dump()

    except Exception as e:
        logger.error(f"Content validation error: {str(e)}")
        return {
            "allowed": False,
            "reason": "Unable to validate message content. Please try again.",
            "raw_response": getattr(result, "content", "Error occurred")
        }
def extract_medical_information(state: chat_interface_state) -> Dict[str, Any]:
    """
    Extract and update medical information from user messages
    """
    last_user_message = ""
    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            last_user_message = message.content.strip()
            break

    if not last_user_message:
        return {}

    system_prompt = f"""
You are a medical information extraction system. Extract relevant medical data from the user's message.

Extract and return in JSON format:
- symptoms: list of symptoms mentioned
- medications: list of medications mentioned
- medical_history: list of medical conditions mentioned
- personal_info: dict with age, gender, name if mentioned
- urgency_level: "low", "medium", "high" based on symptoms

User Message: "{last_user_message}"

Return only valid JSON with the extracted information, or empty objects if nothing found.
"""

    try:
        result = load_llm.invoke([SystemMessage(content=system_prompt)])
        # Parse JSON response
        extracted_data = json.loads(result.content)
        print("extracted data",extracted_data)
        return extracted_data
    except Exception as e:
        logger.error(f"Information extraction error: {str(e)}")
        return {}

def update_state_with_extracted_info(state: chat_interface_state, extracted_info: Dict[str, Any]) -> chat_interface_state:
    """
    Update state with extracted medical information
    """
    if "symptoms" in extracted_info and extracted_info["symptoms"]:
        existing_symptoms = set(state.get("symptoms", []))
        new_symptoms = set(extracted_info["symptoms"])
        state["symptoms"] = list(existing_symptoms.union(new_symptoms))

    if "medications" in extracted_info and extracted_info["medications"]:
        existing_meds = set(state.get("medications_taken", []))
        new_meds = set(extracted_info["medications"])
        state["medications_taken"] = list(existing_meds.union(new_meds))

    if "medical_history" in extracted_info and extracted_info["medical_history"]:
        existing_history = set(state.get("medical_history", []))
        new_history = set(extracted_info["medical_history"])
        state["medical_history"] = list(existing_history.union(new_history))

    if "personal_info" in extracted_info and extracted_info["personal_info"]:
        current_info = state.get("user_info", {})
        current_info.update(extracted_info["personal_info"])
        state["user_info"] = current_info

    return state

def generate_doctor_response(state: chat_interface_state) -> str:
    """
    Generate professional, doctor-like response
    """
    # Get conversation context
    conversation_history = []
    for msg in state["messages"][-6:]:  # Last 6 messages for context
        if isinstance(msg, HumanMessage):
            conversation_history.append(f"Patient: {msg.content}")
        elif isinstance(msg, AIMessage):
            conversation_history.append(f"Doctor: {msg.content}")

    # Get user's latest message
    latest_message = ""
    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            latest_message = message.content.strip()
            break

    # Build comprehensive context
    user_context = f"""
Patient Information:
- Name: {state.get('user_info', {}).get('name', 'Not provided')}
- Age: {state.get('user_info', {}).get('age', 'Not provided')}
- Gender: {state.get('user_info', {}).get('gender', 'Not provided')}

Current Symptoms: {', '.join(state.get('symptoms', [])) or 'None reported'}
Current Medications: {', '.join(state.get('medications_taken', [])) or 'None reported'}
Medical History: {', '.join(state.get('medical_history', [])) or 'None reported'}

Recent Conversation:
{chr(10).join(conversation_history[-4:]) if conversation_history else 'This is the start of conversation'}

Patient's Current Message: "{latest_message}"
"""

    system_prompt = f"""
You are Dr. Sarah, a compassionate and experienced family physician. You provide medical guidance while being warm, professional, and approachable.

PERSONALITY TRAITS:
- Friendly but professional
- Ask follow-up questions to understand symptoms better
- Show empathy and concern
- Use simple, clear language
- Always remind that you provide general guidance, not diagnosis
- Encourage seeing a healthcare provider when necessary
- You have access to patient's previously shared personal information (name, age, gender) and should answer any questions about these details using that information.
Example:
Patient: Do you remember my age?
Doctor: Yes, you are 42 years old.

RESPONSE GUIDELINES:
1. Address the patient's concern directly
2. Ask relevant follow-up questions
3. Provide helpful medical information when appropriate
4. Show empathy and understanding
5. Keep responses conversational but professional
6. If serious symptoms, advise seeking immediate medical care

IMPORTANT DISCLAIMERS TO INCLUDE WHEN RELEVANT:
- "This is general medical information, not a diagnosis"
- "Please consult with a healthcare provider for proper evaluation"
- For urgent symptoms: "You should seek immediate medical attention"

Context about this patient:
{user_context}

Respond as Dr. Sarah would - be helpful, caring, and professional. Keep your response concise but thorough.
"""

    try:
        result = load_llm.invoke([SystemMessage(content=system_prompt)])
        return result.content
    except Exception as e:
        logger.error(f"Response generation error: {str(e)}")
        return "I apologize, but I'm having trouble processing your message right now. Could you please try rephrasing your question?"

def medical_chat_handler(state: chat_interface_state) -> chat_interface_state:
    """
    Main chat handler with complete medical conversation flow
    """
    try:
        # Step 1: Validate content
        validation_result = validate_medical_content(state)
        
        if not validation_result.get("allowed", False):
            rejection_message = (
                "I'm Dr. Sarah, and I'm here to help with your health concerns. "
                f"However, I can only discuss medical topics, symptoms, or health-related questions. "
                f"Could you please ask me about your health instead?"
            )
            
            return Command(
                update={"messages": [AIMessage(content=rejection_message)]},
                goto=END
            )

        # Step 2: Extract medical information
        extracted_info = extract_medical_information(state)
        
        # Step 3: Update state with extracted information
        if extracted_info:
            state = update_state_with_extracted_info(state, extracted_info)

        # Step 4: Generate professional medical response
        doctor_response = generate_doctor_response(state)
        updated_messages = state["messages"] + [AIMessage(content=doctor_response)]

        # Step 5: Return updated state
        print("state",state)
        return Command(
            update={
                "messages": updated_messages,
                "symptoms": state.get("symptoms", []),
                "medications_taken": state.get("medications_taken", []),
                "medical_history": state.get("medical_history", []),
                "user_info": state.get("user_info", {}),
                "latest_user_message": state.get("latest_user_message", ""),
            },
            goto=END,
        )
    

    except Exception as e:
        logger.error(f"Chat handler error: {str(e)}")
        error_response = (
            "I apologize, but I'm experiencing a technical issue. "
            "Please try asking your question again, and I'll do my best to help you."
        )
        
        return Command(
            update={"messages": [AIMessage(content=error_response)]},
            goto=END
        )

def create_initial_state(message: str, user_info: Dict[str, Any] = None) -> chat_interface_state:
    """
    Create initial state for new conversations
    """
    return {
        "messages": [HumanMessage(content=message)],
        "latest_user_message": message,
        "user_info": user_info or {},
        "symptoms": [],
        "medications_taken": [],
        "medical_history": []
    }

# Build the graph
def build_medical_chat_graph() -> StateGraph:
    """
    Build and compile the medical chat graph
    """
    builder = StateGraph(chat_interface_state)
    
    # Add nodes
    builder.add_node("medical_chat_handler", medical_chat_handler)
    
    # Set entry point
    builder.set_entry_point("medical_chat_handler")
    
    # Compile with memory
    graph = builder.compile(checkpointer=memory)
    
    logger.info("Medical chat graph compiled successfully")
    return graph

# Create the graph instance
graph = build_medical_chat_graph()
