import os
import elevenlabs
from elevenlabs.client import ElevenLabs

from gtts import gTTS
def text_to_speech_gtts(input_text,output_filePath):
    langauge="en"
    audioObj = gTTS(
        text=input_text,
        lang=langauge,
        slow=False
    )
    audioObj.save(output_filePath)

input_text="Whatsapp"
text_to_speech_gtts(input_text=input_text,output_filePath="gtts_testing.mp3")

# 2 ELEVEN LABS
ELEVENLABS_API_KEY=os.environ.get("ELEVENLABS_API_KEY")
def text_to_speech_with_elevenlabs(input_text, output_filepath) :
    client=ElevenLabs(api_key=ELEVENLABS_API_KEY)
    audio=client. generate(
    text= input_text,
    voice="Jolly giant",
    output_format= "mp3_22050_32",
    model= "eleven_turbo_v2",
    )
    elevenlabs.save(audio, output_filepath)
text_to_speech_with_elevenlabs ( input_text, output_filepath="eleven habs_testing.mp3")
#Step2: Use Model for Text output to Voice