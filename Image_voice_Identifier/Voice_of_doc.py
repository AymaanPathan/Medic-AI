import os
import elevenlabs
from elevenlabs.client import ElevenLabs
import subprocess
import platform
from gtts import gTTS
from pydub import AudioSegment


def autoPlay(mp3_path,wav_path):
    try:
        # Convert mp3 to wav
        sound = AudioSegment.from_mp3(mp3_path)
        sound.export(wav_path, format="wav")
        os_name = platform.system()
        if os_name == "Darwin":  # macOS
            subprocess.run(['afplay', wav_path])
        elif os_name == "Windows":
            subprocess.run(['powershell', '-c', f'(New-Object Media.SoundPlayer "{wav_path}").PlaySync();'])
        elif os_name == "Linux":
            subprocess.run(['aplay', wav_path])
        else:
            raise OSError("Unsupported operating system")
    except Exception as e:
        print(f"An error occurred while trying to play the audio: {e}")



def text_to_speech_gtts(input_text, mp3_path="gtts_testing.mp3", wav_path="gtts_testing.wav"):
    language = "en"
    # Save mp3
    audioObj = gTTS(text=input_text, lang=language, slow=False)
    audioObj.save(mp3_path)
    try:
        autoPlay(mp3_path=mp3_path,wav_path=wav_path)
    except Exception as e:
        print(f"An error occurred while trying to play the audio: {e}")

# text_to_speech_gtts("autoplay testing is running")



# 2 ELEVEN LABS
ELEVENLABS_API_KEY=os.environ.get("ELEVENLABS_API_KEY")
def text_to_speech_with_elevenlabs(input_text, output_filepath, wav_path="gtts_testing.wav", voice_id=""):
    client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

    audio = client.text_to_speech.convert(
        voice_id=voice_id,
        model_id="eleven_turbo_v2",
        text=input_text,
        output_format="mp3_22050_32"
    )
    elevenlabs.save(audio, output_filepath)

    try:
        autoPlay(mp3_path=output_filepath, wav_path=wav_path)
    except Exception as e:
        print(f"An error occurred while trying to play the audio: {e}")


text_to_speech_with_elevenlabs(
    "You have cough and try to avoid icecream man and also dring hot soup" \
    "it will help your throat",
    output_filepath="eleven_labs_testing.mp3",
    voice_id="TxGEqnHWrfWFTfGW9XjX"
)
