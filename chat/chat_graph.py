from langgraph.graph import StateGraph, END
from chat.chat_state import ChatState
from langgraph.types import Command
import json
from chat.qa_chain import qa_chain
from chat.get_more_question_chain import generate_more_question_chain
from langgraph.checkpoint.memory import MemorySaver
# Fast Api setup
from fastapi import FastAPI
app = FastAPI()

# Test Route
app.get('/')
async def test():
    return {"message": "Hello World"}

memory = MemorySaver()

graph = StateGraph(ChatState)

# Load static symptom info
with open("./docs/symptoms.json", "r") as f:
    symptom_info = json.load(f)


def chat(state: ChatState) -> Command:
    existing_userSymptoms = state.get("userSymptoms", [])
    if existing_userSymptoms:
        return Command(goto="get_user_info")

    symptoms_input = input("Please describe your symptoms: ")
    symptoms = [symptoms_input.strip()]
    return Command(update={"userSymptoms": symptoms}, goto="get_user_info")


def ask_user_info(state: ChatState) -> Command:
    user_info = state.get("user_info")
    if user_info:
        return Command(goto="generate_more")

    user_info_input = input("Can you please provide your age and gender (e.g., '21 Male')? ")
    return Command(update={"user_info": user_info_input}, goto="generate_more")


def generate_more_symptoms(state: ChatState) -> Command:
    print("\n[Generating follow-up questions based on symptoms...]")

    last_msg = state.get("userSymptoms", [])
    llm_output = generate_more_question_chain.invoke(last_msg)

    questions = [
        line.strip(" -").strip()
        for line in llm_output.strip().split("\n")
        if line.strip().endswith("?")
    ]

    print("Generated follow-up questions:")
    for q in questions:
        print(f"- {q}")

    return Command(update={"followupQuestions": questions}, goto="capture_user_responses_to_dynamic_questions")


def capture_user_responses_to_dynamic_questions(state: ChatState) -> Command:
    print("\n[Answer the following follow-up questions]")

    questions = state.get("followupQuestions", [])
    responses = []

    for q in questions:
        answer = input(f"{q} ").strip()
        responses.append(f"{q}: {answer}")

    full_response = "\n".join(responses)
    return Command(update={"user_response": full_response}, goto="final_prompt")


def generate_final_prompt(state: ChatState) -> Command:
    symptoms = state.get("userSymptoms", [])
    user_info = state.get("user_info", "")
    user_response = state.get("user_response", "")
    followup_questions = state.get("followupQuestions", [])

    lines = [
        "User reported the following symptoms:",
        ", ".join(symptoms) + ".",
        f"User info: {user_info}",
        "",
    ]

    if user_response:
        lines.append("Follow-up questions and user's answers:")
        lines.append(user_response)

    if followup_questions:
        lines.append("\nGenerated follow-up questions:")
        lines.extend([f"- {q}" for q in followup_questions])

    lines.append(
        "\nBased on the above information, provide a detailed medical analysis, possible diagnoses, "
        "and recommended next steps. Be clear and concise."
    )

    final_prompt = "\n".join(lines)
    return Command(update={"finalPrompt": final_prompt}, goto="generate_response")


def generate_response(state: ChatState) -> Command:
    prompt = state["finalPrompt"]
    result = qa_chain.invoke(prompt)

    print("\n=== Final Medical Analysis ===")
    print(result)

    return Command(update={"diagnosis_probabilities": result}, goto=END)


# --- Register nodes ---
graph.add_node("chat", chat)
graph.set_entry_point("chat")
graph.add_node("get_user_info", ask_user_info)
graph.add_node("generate_more", generate_more_symptoms)
graph.add_node("capture_user_responses_to_dynamic_questions", capture_user_responses_to_dynamic_questions)
graph.add_node("final_prompt", generate_final_prompt)
graph.add_node("generate_response", generate_response)

# Compile the graph
app = graph.compile(checkpointer=memory)

config = {"configurable": {"thread_id": 1}}
result = app.invoke({}, config=config)

print("\n=== State Output ===")
print(result)
