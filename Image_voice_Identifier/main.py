from groq import Groq
import base64
from elevenlabs.client import ElevenLabs
from elevenlabs import save
import os

# Step 1: Read image
with open("acne.jpg", "rb") as image_file:
    encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

# Step 2: Read typed symptoms from .txt
with open("typed_symptoms.txt", "r", encoding="utf-8") as f:
    query = f.read().strip()

# Step 3: Send to LLM with image
def analyze_image_with_query(model, query, encoded_image):
    client = Groq()
    return client.chat.completions.create(
        model=model,
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": query},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
            ]
        }]
    )

response = analyze_image_with_query("meta-llama/llama-4-scout-17b-16e-instruct", query, encoded_image)
diagnosis = response.choices[0].message.content.strip()

# Step 4: Convert to voice
client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
audio = client.text_to_speech.convert(
    voice_id="TxGEqnHWrfWFTfGW9XjX",
    model_id="eleven_turbo_v2",
    text=diagnosis,
    output_format="mp3_22050_32"
)
save(audio, "final_diagnosis.mp3")
print("✅ Diagnosis and audio generated!")
