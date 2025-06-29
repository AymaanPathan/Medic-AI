# import logging
# from io import BytesIO


# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# def record_audio(file_path_wav="patient_audio_test.wav", timeout=2000, phrase_time_limit=None):
#     recognizer = sr.Recognizer()
#     try:
#         with sr.Microphone() as source:
#             logging.info("Adjusting for ambient noise ... ")
#             recognizer.adjust_for_ambient_noise(source, duration=1)
#             logging.info("Start speaking now ... ")
#             audio_data = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
#             logging.info("Recording complete.")

#             # Save as WAV for Whisper
#             wav_data = audio_data.get_wav_data()
#             audio_segment = AudioSegment.from_wav(BytesIO(wav_data))
#             audio_segment.export(file_path_wav, format="wav")
#             logging.info(f"Audio saved to {file_path_wav}")
#             return file_path_wav

#     except Exception as error:
#         logging.error(f"Error occurred: {error}")
#         return None
    
# record_audio()

# # Take text from audio
# import os
# from groq import Groq

# audio_file_path = "patient_audio_test.wav"
# print(audio_file_path)

# Groq_api = os.environ.get("GROQ_API_KEY_Image")
# stt_model = "whisper-large-v3"
# file=open(audio_file_path,"rb")

# def get_user_voice_with_groq(model,audio_file):
#     client = Groq(api_key=Groq_api)
#     transcript = client.audio.transcriptions.create(
#             model=model,
#             file=audio_file,
#             language="en"
#     )
#     return transcript.text
