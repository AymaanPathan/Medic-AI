from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from Backend.State import (
    FinalPromptInput, FinalPromptOutput, InitInput,
    FollowupInput, FollowupAnswers, DiagnosisInput
)
from Backend.routes.chat.chat_router import router as chat_router
from Backend.routes.thread.thread_router import router as thread_router
from Backend.routes.users.user_router import router as user_router

from Backend.chat.One_Way_Chatting.chat_graph import compiled_graph
from Backend.chat.One_Way_Chatting.get_more_question_chain import generate_more_question_chain
from Backend.chat.One_Way_Chatting.qa_chain import qa_chain
from fastapi.middleware.cors import CORSMiddleware
from Backend.chat.Two_way_Chatting.Main.api.api_server import router as stream_router  
from Backend.routes.auth.auth_router import router as authRouter  
from Backend.socket_config import sio,allowed_origins
from fastapi import UploadFile, File
import base64
from Backend.chat.Image_voice_Identifier.Voice_of_doc import text_to_speech_with_elevenlabs
from groq import Groq
import socketio

# ✅ Step 1: Create FastAPI app for normal HTTP routes
fastapi_app = FastAPI()
fastapi_app.include_router(stream_router)
fastapi_app.include_router(chat_router)
fastapi_app.include_router(thread_router)
fastapi_app.include_router(user_router)
fastapi_app.include_router(authRouter)
# ✅ Step 2: Add CORS to FastAPI
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "userSymptoms": data.userSymptoms
    }
    llm_output = generate_more_question_chain.invoke(state)

    questions = [
        line.strip("- ").strip()
        for line in llm_output.split("\n")
        if line.strip().startswith("-")
    ]
    return {"followupQuestions": questions}

@fastapi_app.post("/get_answers")
async def getAnswers(data: FollowupAnswers):
    state = {
        "symptoms_input": data.userSymptoms, 
        "user_response": data.user_response,
    }
    result = compiled_graph.invoke(state)
    return result

@fastapi_app.post("/generate_final_prompt", response_model=FinalPromptOutput)
async def generate_final_prompt(data: FinalPromptInput):
    symptoms = data.userSymptoms
    formatted_response = data.formatted_response or ""

    lines = [
        "User reported the following symptoms:",
        ", ".join(symptoms) + ".",
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



@fastapi_app.post("/generate_diagnosis")
async def getDiagnosis(data: DiagnosisInput):
    print("Data :" , data)
    print("final :" , data.finalPrompt)
    result = qa_chain.invoke(data.finalPrompt)
    print("result",result)
    return result
   

# ✅ Step 4: Create Socket.IO server


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


# image and voice
@fastapi_app.post("/analyze_with_voice_image")
async def analyze_with_voice_and_image(image: UploadFile = File(...), audio: UploadFile = File(...)):
    # Step 1: Save uploaded image and audio
    image_bytes = await image.read()
    audio_bytes = await audio.read()

    with open("temp_image.jpg", "wb") as f:
        f.write(image_bytes)

    with open("temp_audio.wav", "wb") as f:
        f.write(audio_bytes)

    # Step 2: Get transcript from audio
    with open("temp_audio.wav", "r", encoding="utf-8") as f:
        transcript_text = f.read()

    # Step 3: Encode image for LLM
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    # Step 4: Query Groq LLM with image + text
    client = Groq()
    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": transcript_text},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
            ]
        }]
    )
    diagnosis_text = response.choices[0].message.content

    # Step 5: Convert LLM response to voice
    mp3_path = "output_response.mp3"
    wav_path = "output_response.wav"
    text_to_speech_with_elevenlabs(
        input_text=diagnosis_text,
        output_filepath=mp3_path,
        wav_path=wav_path,
        voice_id="TxGEqnHWrfWFTfGW9XjX"
    )

    # Step 6: Send back text + voice
    return {
        "diagnosis": diagnosis_text,
        "audio_url": "/get_voice_response"
    }


