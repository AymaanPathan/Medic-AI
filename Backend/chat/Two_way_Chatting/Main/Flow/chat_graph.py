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
from chat.Two_way_Chatting.Main.Flow.chat_state import chat_interface_state
from chat.Two_way_Chatting.Main.Flow.model_config import load_llm
from chat.Two_way_Chatting.Main.Flow.MessageFilterModel import parser
from chat.Two_way_Chatting.Main.Flow.model_config import two_way_chatting_qa_chain


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="Medical Chat Assistant", version="1.0.0")
memory = MemorySaver()

class ChatRequest(BaseModel):
    message: str
    thread_id: str
    user_info: Dict[str, Any] = {}

class ChatResponse(BaseModel):
    response: str
    is_allowed: bool
    thread_id: str
    extracted_info: Dict[str, Any] = {}
    urgency_level: str = "normal"
    recommendations: List[str] = []

class DoctorPersonality:
    """
    Defines Dr. Sarah's personality traits and response patterns
    """
    
    @staticmethod
    def get_greeting_style(user_info: Dict) -> str:
        """Dynamic greeting based on user context"""
        name = user_info.get('name', '')
        age = user_info.get('age', '')
        
        if name:
            if age and int(age) < 18:
                return f"Hey there {name}! I'm Dr. Sarah. Don't worry, we'll figure out what's going on together. 😊"
            elif age and int(age) > 65:
                return f"Hello {name}, I'm Dr. Sarah. I'm here to help you feel better. How are you doing today?"
            else:
                return f"Hi {name}! Dr. Sarah here. Let's see what's bothering you today."
        else:
            return "Hey! I'm Dr. Sarah, your AI doctor. Before we dive in, what should I call you?"

    @staticmethod
    def get_sarcastic_response(context: str) -> str:
        """Generate contextual sarcastic but caring responses"""
        sarcastic_responses = {
            "vague_symptoms": [
                "Hold up there, detective! 🕵️ 'I feel bad' is like saying 'my car makes a noise' to a mechanic. Give me the juicy details!",
                "Whoa, slow down with all those specific details! 😄 Let's dig deeper - what exactly is bothering you?",
                "I'm good, but I'm not a mind reader! Help me help you - what's really going on?"
            ],
            "self_diagnosis": [
                "Easy there, Dr. Google! 😏 I appreciate the research, but let me do the diagnosing. Tell me about your actual symptoms.",
                "I see someone's been busy on WebMD! Let's focus on what you're actually experiencing, not what the internet thinks.",
                "Hold your horses, future doctor! Let me ask the questions first, then we'll figure this out together."
            ],
            "immediate_medicine": [
                "Whoa there, speed racer! 🏎️ You want medicine but haven't told me what's wrong? That's like asking for a key without telling me what door you're trying to open!",
                "Medicine without symptoms? That's not how this works! 😄 Let's talk about what's bothering you first.",
                "Pump the brakes! I'm not a vending machine. Tell me what's going on, and then we'll talk treatment."
            ]
        }
        
        return sarcastic_responses.get(context, ["Let's figure this out together! 😊"])[0]

    @staticmethod
    def get_empathetic_response(urgency: str) -> str:
        """Generate empathetic responses based on urgency"""
        if urgency == "high":
            return "I can hear the concern in your message, and I want to help you right away."
        elif urgency == "emergency":
            return "This sounds serious and I'm worried about you. Let's address this immediately."
        else:
            return "I understand this is bothering you, and I'm here to help figure it out."

def analyze_message_pattern(message: str, conversation_history: List) -> str:
    """
    Analyze user message patterns to determine appropriate response style
    """
    message_lower = message.lower()
    
    # Check for vague symptoms
    vague_patterns = ['feel bad', 'not well', 'sick', 'unwell', 'off', 'wrong']
    if any(pattern in message_lower for pattern in vague_patterns) and len(message.split()) < 6:
        return "vague_symptoms"
    
    # Check for self-diagnosis attempts
    diagnosis_patterns = ['i think i have', 'i probably have', 'it might be', 'google says', 'webmd', 'diagnosed myself']
    if any(pattern in message_lower for pattern in diagnosis_patterns):
        return "self_diagnosis"
    
    # Check for immediate medicine requests without context
    medicine_patterns = ['give me medicine', 'what medicine', 'prescribe', 'medication for']
    symptom_context = ['pain', 'hurt', 'ache', 'fever', 'cough', 'headache', 'nausea']
    
    if any(pattern in message_lower for pattern in medicine_patterns):
        if not any(symptom in message_lower for symptom in symptom_context):
            return "immediate_medicine"
    
    return "normal"

def enhanced_medical_information_extraction(state: chat_interface_state) -> Dict[str, Any]:
    """
    Enhanced extraction with better medical context understanding
    """
    last_user_message = ""
    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            last_user_message = message.content.strip()
            break

    if not last_user_message:
        return {}

    # Build comprehensive medical context
    user_info = state.get("user_info", {})
    current_symptoms = state.get("symptoms", [])
    current_medications = state.get("medications_taken", [])
    current_history = state.get("medical_history", [])
    
    system_prompt = f"""
You are an expert medical information extraction system. Extract comprehensive medical information from the user's message.

PATIENT CONTEXT:
- Age: {user_info.get('age', 'Unknown')}
- Gender: {user_info.get('gender', 'Unknown')}
- Known Symptoms: {', '.join(current_symptoms) if current_symptoms else 'None'}
- Current Medications: {', '.join(current_medications) if current_medications else 'None'}
- Medical History: {', '.join(current_history) if current_history else 'None'}

USER MESSAGE: "{last_user_message}"

Extract the following information with high accuracy:

1. SYMPTOMS - Be specific and detailed:
   - Include location, severity (1-10), duration, quality (sharp, dull, throbbing, etc.)
   - Associated symptoms (nausea with headache, etc.)
   - Timing patterns (morning, after eating, etc.)

2. MEDICATIONS - Include:
   - Names, dosages, frequency, duration of use
   - Over-the-counter and prescription drugs
   - Supplements and herbal remedies

3. MEDICAL HISTORY:
   - Past surgeries, chronic conditions, family history
   - Previous similar episodes
   - Allergies and adverse reactions

4. CONTEXTUAL FACTORS:
   - Recent travel, stress, diet changes
   - Activity level, sleep patterns
   - Environmental factors

5. PATIENT COMMUNICATION STYLE:
   - Anxiety level (low/medium/high)
   - Health literacy (basic/intermediate/advanced)
   - Communication preference (detailed/brief)

Return ONLY valid JSON:
{{
    "symptoms": [
        {{
            "name": "specific symptom name",
            "location": "body part/region",
            "severity": "1-10 or description",
            "duration": "how long",
            "quality": "sharp/dull/burning/etc",
            "triggers": ["what makes worse"],
            "relievers": ["what makes better"],
            "associated_symptoms": ["related symptoms"]
        }}
    ],
    "medications": [
        {{
            "name": "medication name",
            "dosage": "amount and unit",
            "frequency": "how often",
            "duration": "how long taking",
            "reason": "why taking"
        }}
    ],
    "medical_history": [
        {{
            "condition": "condition name",
            "year": "when diagnosed/occurred",
            "status": "active/resolved/chronic",
            "treatment": "how treated"
        }}
    ],
    "lifestyle_factors": {{
        "sleep": "sleep pattern info",
        "stress": "stress level/sources",
        "diet": "recent changes or relevant info",
        "exercise": "activity level",
        "smoking": "smoking status",
        "alcohol": "alcohol consumption"
    }},
    "urgency_indicators": {{
        "level": "low/medium/high/emergency",
        "red_flags": ["concerning symptoms"],
        "reasoning": "why this urgency level"
    }},
    "patient_communication": {{
        "anxiety_level": "low/medium/high",
        "health_literacy": "basic/intermediate/advanced",
        "primary_concern": "main worry/question",
        "communication_style": "detailed/brief/anxious/confident"
    }},
    "missing_info_needed": ["what additional info would help diagnosis"],
    "confidence": "high/medium/low"
}}
"""

    try:
        result = load_llm.invoke([SystemMessage(content=system_prompt)])
        extracted_data = json.loads(result.content)
        logger.info(f"Enhanced medical extraction completed with confidence: {extracted_data.get('confidence')}")
        return extracted_data
    except json.JSONDecodeError as e:
        logger.warning(f"JSON parsing error in enhanced extraction: {str(e)}")
        return {}
    except Exception as e:
        logger.error(f"Enhanced medical extraction error: {str(e)}")
        return {}

def generate_medication_recommendations(symptoms: List, patient_context: Dict, rag_context: str) -> Dict[str, Any]:
    """
    Generate detailed medication recommendations with proper medical formatting
    """
    system_prompt = f"""
You are Dr. Sarah, an experienced physician. Generate medication recommendations based on the patient's symptoms and context.

PATIENT CONTEXT:
{json.dumps(patient_context, indent=2)}

SYMPTOMS:
{json.dumps(symptoms, indent=2)}

MEDICAL KNOWLEDGE BASE:
{rag_context}

MEDICATION RECOMMENDATION GUIDELINES:
1. Always start with non-pharmacological treatments when appropriate
2. Recommend over-the-counter options before prescription medications
3. Include dosage, frequency, duration, and important warnings
4. Explain mechanism of action in simple terms
5. Mention potential side effects and contraindications
6. Provide alternative options
7. Include when to seek further medical care

Return medication recommendations in this JSON format:
{{
    "primary_recommendations": [
        {{
            "medication_name": "Generic Name (Brand Name)",
            "category": "Pain reliever/Antihistamine/etc",
            "dosage": "specific dosage",
            "frequency": "how often",
            "duration": "how long to take",
            "mechanism": "how it works (simple explanation)",
            "side_effects": ["common side effects"],
            "contraindications": ["when not to use"],
            "special_instructions": "take with food, etc",
            "otc_prescription": "OTC or Prescription"
        }}
    ],
    "alternative_options": [
        {{
            "medication_name": "Alternative option",
            "reason": "why this alternative",
            "dosage": "dosage info"
        }}
    ],
    "non_pharmacological": [
        {{
            "treatment": "rest, heat, etc",
            "instructions": "how to do it",
            "expected_timeline": "when to expect results"
        }}
    ],
    "warning_signs": ["symptoms that require immediate medical attention"],
    "follow_up": "when to see a doctor if symptoms persist",
    "confidence_level": "high/medium/low",
    "disclaimer": "appropriate medical disclaimer"
}}

Be thorough but accessible. Remember, you're talking to a patient, not another doctor.
"""

    try:
        result = load_llm.invoke([SystemMessage(content=system_prompt)])
        return json.loads(result.content)
    except Exception as e:
        logger.error(f"Medication recommendation error: {str(e)}")
        return {"error": "Unable to generate medication recommendations"}

def format_medication_response(recommendations: Dict[str, Any]) -> str:
    """
    Format medication recommendations in beautiful markdown
    """
    if "error" in recommendations:
        return "I'm having trouble accessing my medication database right now. Let me give you some general guidance based on your symptoms."

    response = "## 💊 **Medication Recommendations**\n\n"
    
    # Primary recommendations
    if recommendations.get("primary_recommendations"):
        response += "### **Primary Treatment Options:**\n\n"
        for i, med in enumerate(recommendations["primary_recommendations"], 1):
            response += f"**{i}. {med.get('medication_name', 'Unknown')}** *({med.get('category', 'General')})*\n"
            response += f"- **Dosage:** {med.get('dosage', 'As directed')}\n"
            response += f"- **Frequency:** {med.get('frequency', 'As needed')}\n"
            response += f"- **Duration:** {med.get('duration', 'Until symptoms improve')}\n"
            response += f"- **How it works:** {med.get('mechanism', 'Provides symptom relief')}\n"
            
            if med.get('side_effects'):
                response += f"- **Common side effects:** {', '.join(med['side_effects'])}\n"
            
            if med.get('special_instructions'):
                response += f"- **Special instructions:** {med['special_instructions']}\n"
            
            response += f"- **Type:** {med.get('otc_prescription', 'OTC')} medication\n\n"

    # Alternative options
    if recommendations.get("alternative_options"):
        response += "### **Alternative Options:**\n\n"
        for alt in recommendations["alternative_options"]:
            response += f"- **{alt.get('medication_name')}:** {alt.get('reason')} - {alt.get('dosage')}\n"
        response += "\n"

    # Non-pharmacological treatments
    if recommendations.get("non_pharmacological"):
        response += "### **🌿 Natural & Home Remedies:**\n\n"
        for treatment in recommendations["non_pharmacological"]:
            response += f"- **{treatment.get('treatment')}:** {treatment.get('instructions')} "
            response += f"*(Expect results: {treatment.get('expected_timeline', 'varies')})*\n"
        response += "\n"

    # Warning signs
    if recommendations.get("warning_signs"):
        response += "### **🚨 Seek Immediate Medical Care If:**\n\n"
        for warning in recommendations["warning_signs"]:
            response += f"- {warning}\n"
        response += "\n"

    # Follow-up
    if recommendations.get("follow_up"):
        response += f"### **⏰ Follow-up Care:**\n{recommendations['follow_up']}\n\n"

    # Disclaimer
    response += "---\n"
    response += "*This information is for educational purposes. Always consult with a healthcare provider before starting new medications.*"

    return response

def generate_doctor_response_with_personality(state: chat_interface_state, rag_context: str = "", 
                                            extracted_info: Dict[str, Any] = None) -> str:
    """
    Generate responses with Dr. Sarah's personality - professional but engaging
    """
    try:
        # Get user's latest message and analyze pattern
        latest_message = ""
        for message in reversed(state["messages"]):
            if isinstance(message, HumanMessage):
                latest_message = message.content.strip()
                break

        message_pattern = analyze_message_pattern(latest_message, state["messages"])
        
        # Build patient context
        user_info = state.get("user_info", {})
        symptoms = state.get("symptoms", [])
        medications = state.get("medications_taken", [])
        medical_history = state.get("medical_history", [])
        urgency = extracted_info.get("urgency_indicators", {}) if extracted_info else {}
        
        # Determine if this is first interaction
        is_first_interaction = len(state["messages"]) <= 1
        
        # Generate medication recommendations if appropriate
        medication_response = ""
        if symptoms and any(keyword in latest_message.lower() for keyword in ['medicine', 'medication', 'treatment', 'prescribe']):
            med_recommendations = generate_medication_recommendations(symptoms, user_info, rag_context)
            medication_response = format_medication_response(med_recommendations)

        # Build conversation context
        conversation_history = []
        for msg in state["messages"][-6:]:
            if isinstance(msg, HumanMessage):
                conversation_history.append(f"Patient: {msg.content}")
            elif isinstance(msg, AIMessage):
                conversation_history.append(f"Dr. Sarah: {msg.content}")

        # Build comprehensive system prompt
        system_prompt = f"""
You are Dr. Sarah, a brilliant and caring family physician with 15+ years of experience. You have a warm personality with just the right amount of humor and gentle sarcasm when appropriate. You're known for:

1. **Professional Excellence:** Evidence-based medicine with clear explanations
2. **Engaging Personality:** Friendly, slightly sarcastic when patients are vague, but always caring
3. **Clear Communication:** Using markdown formatting for organized, readable responses
4. **Personalized Care:** Remembering patient details and building rapport

PATIENT PROFILE:
- Name: {user_info.get('name', 'Not provided')}
- Age: {user_info.get('age', 'Not provided')}
- Gender: {user_info.get('gender', 'Not provided')}
- Current Symptoms: {', '.join(symptoms) if symptoms else 'None reported'}
- Medications: {', '.join(medications) if medications else 'None'}
- Medical History: {', '.join(medical_history) if medical_history else 'None'}
- Urgency Level: {urgency.get('level', 'Normal')}

CONVERSATION CONTEXT:
{chr(10).join(conversation_history[-4:]) if conversation_history else 'This is the start of our conversation'}

CURRENT MESSAGE: "{latest_message}"
MESSAGE PATTERN: {message_pattern}

MEDICAL KNOWLEDGE BASE:
{rag_context if rag_context else "Standard medical knowledge"}

EXTRACTED MEDICAL INFO:
{json.dumps(extracted_info, indent=2) if extracted_info else "No specific medical info extracted"}

MEDICATION RECOMMENDATIONS:
{medication_response if medication_response else "No medication recommendations generated"}

RESPONSE GUIDELINES:

**For First Interactions:**
- Use warm, welcoming greeting
- If no name provided, ask for it in a friendly way
- Set expectations about how you work

**For Vague Symptoms ({message_pattern == 'vague_symptoms'}):**
- Use gentle sarcasm with humor: "{DoctorPersonality.get_sarcastic_response('vague_symptoms')}"
- Then ask specific, targeted questions
- Show you care while encouraging more details

**For Self-Diagnosis Attempts ({message_pattern == 'self_diagnosis'}):**
- Acknowledge their research with humor: "{DoctorPersonality.get_sarcastic_response('self_diagnosis')}"
- Redirect to proper symptom assessment
- Explain why proper evaluation matters

**For Immediate Medicine Requests ({message_pattern == 'immediate_medicine'}):**
- Use playful sarcasm: "{DoctorPersonality.get_sarcastic_response('immediate_medicine')}"
- Explain need for proper assessment first
- Then guide through symptom evaluation

**For High Urgency Situations:**
- Drop the humor, be serious and empathetic
- Provide clear, immediate guidance
- Emphasize need for professional care

**Response Formatting:**
- Use markdown headers (##, ###) for organization
- Use bullet points for lists
- Use **bold** for important information
- Use *italics* for emphasis
- Include relevant emojis sparingly
- If providing medication info, use the formatted medication response

**Personality Traits to Show:**
- Confident but humble
- Caring but not overly sentimental  
- Humorous when appropriate, serious when needed
- Detail-oriented but accessible
- Remember previous conversation details

**CRITICAL:** 
- If patient asks for "best 3 medicines" or similar, provide detailed markdown-formatted medication information
- Always include appropriate medical disclaimers
- Escalate serious symptoms appropriately
- Ask follow-up questions to gather needed information
- Address the patient by name when known

Generate a response that feels like talking to a real doctor who cares about the patient and has a great bedside manner with just the right amount of personality.
"""

        result = load_llm.invoke([SystemMessage(content=system_prompt)])
        
        # Log response generation
        logger.info(f"Generated personality-driven response - Pattern: {message_pattern}, "
                   f"First interaction: {is_first_interaction}, "
                   f"Urgency: {urgency.get('level', 'normal')}")
        
        return result.content
        
    except Exception as e:
        logger.error(f"Personality response generation error: {str(e)}")
        
        # Fallback with personality
        user_name = state.get("user_info", {}).get("name", "")
        if user_name:
            return f"Hey {user_name}, I'm having a bit of a brain fog moment here! 😅 " \
                   f"Can you help me out by asking your question again? I promise I'll be more helpful this time!"
        else:
            return "Well, this is embarrassing! 😳 I seem to be having a technical hiccup. " \
                   "Mind giving me another shot at helping you? I'm usually much sharper than this!"

def enhanced_medical_chat_handler(state: chat_interface_state) -> chat_interface_state:
    """
    Enhanced chat handler with personality and better medical understanding
    """
    try:
        # Step 1: Content validation (keeping existing logic)
        validation_result = validate_medical_content_with_llm(state)
        
        if not validation_result.get("allowed", False):
            user_name = state.get("user_info", {}).get("name", "")
            greeting = DoctorPersonality.get_greeting_style(state.get("user_info", {}))
            
            rejection_message = f"{greeting}\n\n" \
                              f"I'm specifically designed to help with health-related questions and medical concerns. " \
                              f"{validation_result.get('reason', '')} What health issue can I help you with today?"
            
            return Command(
                update={"messages": [AIMessage(content=rejection_message)]},
                goto=END
            )

        # Step 2: Enhanced RAG retrieval with better context
        try:
            # Build better query for RAG
            user_message = state["latest_user_message"]
            symptoms = state.get("symptoms", [])
            context_query = f"{user_message} {' '.join(symptoms)}"
            
            rag_response = two_way_chatting_qa_chain.invoke(context_query)
            rag_context = rag_response.get("result", "") if isinstance(rag_response, dict) else str(rag_response)
            logger.info(f"Enhanced RAG retrieval - Query: {context_query[:100]}")
        except Exception as e:
            logger.warning(f"RAG retrieval failed: {str(e)}")
            rag_context = ""

        # Step 3: Enhanced medical information extraction
        extracted_info = enhanced_medical_information_extraction(state)
        
        # Step 4: Update patient state with enhanced information
        if extracted_info:
            # Update symptoms with detailed information
            if extracted_info.get("symptoms"):
                detailed_symptoms = []
                for symptom in extracted_info["symptoms"]:
                    symptom_desc = f"{symptom.get('name', 'Unknown symptom')}"
                    if symptom.get('location'):
                        symptom_desc += f" in {symptom['location']}"
                    if symptom.get('severity'):
                        symptom_desc += f" (severity: {symptom['severity']})"
                    if symptom.get('duration'):
                        symptom_desc += f" for {symptom['duration']}"
                    detailed_symptoms.append(symptom_desc)
                
                state["symptoms"] = list(set(state.get("symptoms", []) + detailed_symptoms))

            # Update medications with detailed information
            if extracted_info.get("medications"):
                detailed_meds = []
                for med in extracted_info["medications"]:
                    med_desc = f"{med.get('name', 'Unknown medication')}"
                    if med.get('dosage'):
                        med_desc += f" {med['dosage']}"
                    if med.get('frequency'):
                        med_desc += f" {med['frequency']}"
                    detailed_meds.append(med_desc)
                
                state["medications_taken"] = list(set(state.get("medications_taken", []) + detailed_meds))

            # Store enhanced medical context
            state["detailed_medical_info"] = extracted_info

        # Step 5: Generate personality-driven response
        doctor_response = generate_doctor_response_with_personality(
            state, 
            rag_context=rag_context, 
            extracted_info=extracted_info
        )
        
        # Step 6: Update state with comprehensive information
        updated_messages = state["messages"] + [AIMessage(content=doctor_response)]
        
        return Command(
            update={
                "messages": updated_messages,
                "symptoms": state.get("symptoms", []),
                "medications_taken": state.get("medications_taken", []),
                "medical_history": state.get("medical_history", []),
                "user_info": state.get("user_info", {}),
                "latest_user_message": state.get("latest_user_message", ""),
                "detailed_medical_info": state.get("detailed_medical_info", {}),
            },
            goto=END,
        )
    
    except Exception as e:
        logger.error(f"Enhanced chat handler error: {str(e)}", exc_info=True)
        
        # Personality-driven error response
        error_responses = [
            "Oops! Looks like I had a bit of a brain freeze there! 🧠❄️ Can you try again?",
            "Well, that's embarrassing! My medical brain just hiccupped. Give me another shot?",
            "Houston, we have a problem! 🚀 But don't worry, just ask me again and I'll be back to my sharp self!"
        ]
        
        import random
        error_response = random.choice(error_responses)
        error_response += "\n\n*If you have urgent symptoms, please contact your healthcare provider or emergency services.*"
        
        return Command(
            update={"messages": [AIMessage(content=error_response)]},
            goto=END
        )

# Update the graph building function
def build_enhanced_medical_chat_graph() -> StateGraph:
    """
    Build enhanced medical chat graph with personality
    """
    try:
        builder = StateGraph(chat_interface_state)
        
        # Add the enhanced chat handler node
        builder.add_node("enhanced_medical_chat_handler", enhanced_medical_chat_handler)
        
        # Set entry and finish points
        builder.set_entry_point("enhanced_medical_chat_handler")
        builder.set_finish_point("enhanced_medical_chat_handler")
        
        # Compile with memory checkpointer
        graph = builder.compile(checkpointer=memory)
        
        logger.info("Enhanced medical chat graph with personality compiled successfully")
        return graph
        
    except Exception as e:
        logger.error(f"Failed to build enhanced chat graph: {str(e)}")
        raise

# Create the enhanced graph instance
enhanced_graph = build_enhanced_medical_chat_graph()

# Additional utility functions for better user experience
def validate_medical_content_with_llm(state: chat_interface_state) -> Dict[str, Any]:
    """
    Enhanced content validation with better medical context understanding
    """
    # Get the latest user message
    last_user_message = ""
    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            last_user_message = message.content.strip()
            break

    if not last_user_message:
        return {"allowed": False, "reason": "No valid user message found."}

    # Build conversation context
    conversation_context = []
    for msg in state["messages"][-4:]:
        if isinstance(msg, HumanMessage):
            conversation_context.append(f"User: {msg.content[:100]}")
        elif isinstance(msg, AIMessage):
            conversation_context.append(f"Dr. Sarah: {msg.content[:100]}")

    context_str = "\n".join(conversation_context) if conversation_context else "First message"

    system_prompt = f"""
You are a medical content classifier for Dr. Sarah's healthcare chat system. Determine if the user's message is medically relevant.

CONVERSATION CONTEXT:
{context_str}

CURRENT MESSAGE: "{last_user_message}"

ENHANCED CLASSIFICATION RULES:

DEFINITELY ALLOWED (Medical Content):
✓ Health symptoms, pain, discomfort descriptions
✓ Medical questions and health concerns
✓ Medication inquiries and side effects
✓ Personal medical history sharing
✓ Health-related greetings and check-ins
✓ Follow-up questions about medical advice
✓ Emergency or urgent health situations
✓ Mental health and wellness questions
✓ Preventive care and lifestyle health questions
✓ Questions about medical procedures or tests
✓ Asking for medical recommendations or treatment options

PROBABLY ALLOWED (Context-Dependent):
⚠️ General wellness and lifestyle questions
⚠️ Nutrition and exercise questions related to health
⚠️ Questions about medical professionals or healthcare system
⚠️ Medical research or studies questions

NOT ALLOWED (Non-Medical):
✗ Pure entertainment (jokes, games, stories unrelated to health)
✗ Technical support for non-medical issues
✗ Political discussions unrelated to healthcare
✗ General academic help unrelated to medicine
✗ Financial advice unrelated to healthcare costs
✗ Legal advice unrelated to medical law
✗ Personal relationship advice unrelated to health

RESPONSE FORMAT:
{{
    "allowed": true/false,
    "reason": "clear explanation",
    "confidence": "high/medium/low",
    "medical_context_score": 1-10,
    "suggested_response_tone": "professional/empathetic/urgent/educational/sarcastic"
}}

Be generous with health-related content but maintain boundaries for non-medical topics.
"""

    try:
        result = load_llm.invoke([SystemMessage(content=system_prompt)])
        parsed_result = json.loads(result.content)
        
        logger.info(f"Enhanced validation - Allowed: {parsed_result.get('allowed')}, "
                   f"Medical score: {parsed_result.get('medical_context_score')}")
        
        return parsed_result
        
    except json.JSONDecodeError:
        logger.warning(f"JSON parsing error in validation: {result.content}")
        return {
            "allowed": True,
            "reason": "Fallback validation - proceeding with caution",
            "confidence": "low",
            "medical_context_score": 5,
            "suggested_response_tone": "professional"
        }
        
    except Exception as e:
        logger.error(f"Enhanced validation error: {str(e)}")
        return {
            "allowed": True,
            "reason": "Technical validation issue - proceeding safely",
            "confidence": "low",
            "medical_context_score": 5,
            "suggested_response_tone": "professional"
        }
        