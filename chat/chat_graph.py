from langgraph.graph import StateGraph, END
from chat.chat_state import ChatState
from langgraph.types import Command
import json
from chat.qa_chain import qa_chain
from chat.get_more_question_chain import generate_more_question_chain

graph = StateGraph(ChatState)

# Load static symptom info
with open("./docs/symptoms.json", "r") as f:
    symptom_info = json.load(f)


# 1. start the chat
def chat(state: ChatState) -> Command:
    print("[chat node] Incoming state:", state)

    symptoms_input = state.get("symptoms_input")

    if not symptoms_input:
        print("[chat node] No symptoms_input provided. Ending flow.")
        return Command(update={"error": "No symptoms provided"}, goto=END)

    symptoms = symptoms_input.strip()
    print("[chat node] Parsed symptoms:", symptoms)

    return Command(
        update={"userSymptoms": symptoms},
        goto="get_user_info"
    )


# 2. ask personal question
def ask_user_info(state: ChatState) -> Command:
    user_info = state.get("user_info")
    if user_info:
        return Command(goto="generate_more")

    if not state.get("user_info"):
        return Command(update={"error": "user_info missing"}, goto=END)
    return Command(goto="generate_more")

# 3. generate more question
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

# 4. get user answer based on question 
def capture_user_responses_to_dynamic_questions(state: ChatState) -> Command:
    print("\n[Answer the following follow-up questions]")

    questions = state.get("followupQuestions", [])
    user_answers = state.get("user_response", {})  # dict of {question: answer}

    if not isinstance(user_answers, dict):
        return Command(update={"error": "user_response should be a dictionary"}, goto=END)

    missing = [q for q in questions if q not in user_answers]
    if missing:
        return Command(update={"error": f"Missing answers to: {missing}"}, goto=END)

    # Format each question: answer pair
    responses = [f"{q}: {user_answers[q]}" for q in questions]
    full_response = "\n".join(responses)

    return Command(update={"user_response": user_answers, "formatted_response": full_response}, goto="final_prompt")


# 5. generate final prompt with all question and answers
def generate_final_prompt(state: ChatState) -> Command:
    symptoms = state.get("userSymptoms", [])
    user_info = state.get("user_info", "")
    formatted_response = state.get("formatted_response", "")

    lines = [
        "User reported the following symptoms:",
        ", ".join(symptoms) + ".",
        f"User info: {user_info}",
        "",
    ]

    if formatted_response:
        lines.append("Follow-up questions and user's answers:")
        lines.append(formatted_response)

    lines.append(
        "\nBased on the above information, provide a detailed medical analysis, possible diagnoses, "
        "and recommended next steps. Be clear and concise."
    )

    final_prompt = "\n".join(lines)
    return Command(update={"finalPrompt": final_prompt}, goto="generate_response")


# 6. LLM will generate final answer 
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
compiled_graph  = graph.compile()

# config = {"configurable": {"thread_id": 1}}
# result = compiled_graph.invoke({}, config=config)

# print("\n=== State Output ===")
# print(result)

