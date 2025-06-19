from fastapi import FastAPI
from api.State import FinalPromptInput, FinalPromptOutput, InitInput, FollowupInput, FollowupAnswers, DiagnosisInput, UserInfoInput
from chat.chat_graph import compiled_graph, generate_final_prompt
from chat.get_more_question_chain import generate_more_question_chain
from chat.qa_chain import qa_chain
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
app = FastAPI()
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def test():
    return {"message": "Hello medic-man"}

# 1 Initialize the chat first time
@app.post("/init")
async def initializeChat(data: InitInput):
    state = {"symptoms_input": data.userSymptoms}
    result = compiled_graph.invoke(state)
    return result

# 2 get more personal information like age/gender
@app.post("/get_personal_info")
async def getInfo(data: UserInfoInput):
    state = {"user_info": data.user_info}
    result = compiled_graph.invoke(state)
    return result

@app.post("/generate_followUp")
async def generate_follow_up(data: FollowupInput):
    state = {
        "user_info":data.user_info,
        "userSymptoms":data.userSymptoms
    }
    llm_output = generate_more_question_chain.invoke(state)

    questions = [
        line.strip("- ").strip()
        for line in llm_output.split("\n")
        if line.strip().startswith("-")
    ]

    return {"followupQuestions": questions}

# 3 LLM generate more question
@app.post("/generate_final_prompt", response_model=FinalPromptOutput)
async def generate_final_prompt(data: FinalPromptInput):
    symptoms = data.userSymptoms
    user_info = data.user_info
    formatted_response = data.formatted_response or ""

    lines = [
        "User reported the following symptoms:",
        ", ".join(symptoms) + ".",
        f"User info: {user_info}",
        "",
    ]

    if formatted_response:
        lines.append("Follow-up questions and user's answers:")

        # Pretty format dictionary if it's not already a string
        if isinstance(formatted_response, dict):
            for q, a in formatted_response.items():
                lines.append(f"Q: {q}\nA: {a}")
        else:
            lines.append(str(formatted_response))  # fallback


    lines.append(
        "\nBased on the above information, provide a detailed medical analysis, possible diagnoses, "
        "and recommended next steps. Be clear and concise."
    )

    final_prompt = "\n".join(lines)
    return {"final_prompt": final_prompt}


# 4 Provide answers to follow-up questions
@app.post("/get_answers")
async def getAnswers(data: FollowupAnswers):
    state = {"user_response": data.user_response}
    result = compiled_graph.invoke(state)
    return result


# 5 generate final Prompt
@app.post("/generate_final_prompt")
async def generateFinalPrompt(data: FinalPromptInput):
    symptoms = data.userSymptoms
    user_info = data.user_info
    formatted_response = data.formatted_response

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

    return {"finalPrompt": final_prompt}



# 5 Generate final diagnosis from all state
@app.post("/generate_diagnosis")
async def getDiagnosis(data: DiagnosisInput):
    # result = qa_chain.invoke(data.finalPrompt)
    # return result

    async for event in qa_chain.astream_events(data.finalPrompt):
             print(event, end="|", flush=True)
