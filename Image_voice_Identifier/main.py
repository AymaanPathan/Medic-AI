from groq import Groq
import base64
client = Groq()

model = "meta-llama/llama-4-scout-17b-16e-instruct"  
image_path = "D:/Medic-chat/Medic-AI/Image_voice_Identifier/acne.jpg"
with open(image_path, "rb") as image_file:
    encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

messages = [{
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "is something wrong with my face?" #take this from user
        },
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{encoded_image}" #take this from user
            }
        }
    ]
}]

completion = client.chat.completions.create(
    messages=messages,
    model=model,
)

print(completion.choices[0].message.content)
