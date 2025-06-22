from groq import Groq
import base64
from voice_convert_to_text import transcript

def analyze_image_with_query(model,query,encoded_image):
    client = Groq()
    messages = [{
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": query
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{encoded_image}" 
                }
            }
        ]
    }]

    return client.chat.completions.create(
        messages=messages,
        model=model,
    )


model = "meta-llama/llama-4-scout-17b-16e-instruct"  
query = transcript.text

image_path = "D:/Medic-chat/Medic-AI/Image_voice_Identifier/acne.jpg"
with open(image_path, "rb") as image_file:
    encoded_image = base64.b64encode(image_file.read()).decode("utf-8")


response =analyze_image_with_query(model,query,encoded_image)
