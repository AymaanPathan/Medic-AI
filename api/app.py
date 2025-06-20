import json
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from api.State import (
    FinalPromptInput, FinalPromptOutput, InitInput,
    FollowupInput, FollowupAnswers, DiagnosisInput
)
from fastapi.responses import StreamingResponse
from chat.chat_graph import compiled_graph
from chat.get_more_question_chain import generate_more_question_chain
from chat.qa_chain import qa_chain
from fastapi.middleware.cors import CORSMiddleware
import socketio
allowed_origins = ["http://localhost:5174","http://localhost:5173"]
# ✅ Step 1: Create FastAPI app for normal HTTP routes
fastapi_app = FastAPI()

# ✅ Step 2: Add CORS to FastAPI
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Step 3: Define REST API routes on fastapi_app

@fastapi_app.get("/")
async def test():
    return {"message": "Hello medic-man"}

@fastapi_app.post("/init")
async def initializeChat(data: InitInput):
    state = {"symptoms_input": data.userSymptoms}
    result = compiled_graph.invoke(state)
    return result



@fastapi_app.post("/generate_followUp")
async def generate_follow_up(data: FollowupInput):
    state = {
        "user_info": data.user_info,
        "userSymptoms": data.userSymptoms
    }
    llm_output = generate_more_question_chain.invoke(state)

    questions = [
        line.strip("- ").strip()
        for line in llm_output.split("\n")
        if line.strip().startswith("-")
    ]
    return {"followupQuestions": questions}

@fastapi_app.post("/generate_final_prompt", response_model=FinalPromptOutput)
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
        if isinstance(formatted_response, dict):
            for q, a in formatted_response.items():
                lines.append(f"Q: {q}\nA: {a}")
        else:
            lines.append(str(formatted_response))

    lines.append(
        "\nBased on the above information, provide a detailed medical analysis, "
        "possible diagnoses, and recommended next steps. Be clear and concise."
    )

    final_prompt = "\n".join(lines)
    return {"final_prompt": final_prompt}

@fastapi_app.post("/get_answers")
async def getAnswers(data: FollowupAnswers):
    state = {"user_response": data.user_response}
    result = compiled_graph.invoke(state)
    return result

@fastapi_app.post("/generate_diagnosis")
async def getDiagnosis(data: DiagnosisInput):
    result = qa_chain.invoke(data.finalPrompt)
    return result
   


# ✅ Step 4: Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=allowed_origins
)

@sio.on("start_diagnosis")
async def handle_diagnosis(sid, data):
    prompt = data.get("finalPrompt")
    if not prompt:
        await sio.emit("diagnosis_chunk", {"error": "Prompt is missing"}, to=sid)
        return

    async for chunk in qa_chain.astream(prompt):
        # 🔥 Make sure you're sending actual object, not stringified JSON
        await sio.emit("diagnosis_chunk", {"text": jsonable_encoder(chunk)}, to=sid)

    await sio.emit("diagnosis_done", {"message": "complete"}, to=sid)

# ✅ Step 5: Wrap FastAPI app in ASGIApp with Socket.IO
app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=fastapi_app,
    socketio_path="/socket.io"
)
