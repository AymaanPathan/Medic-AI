from langchain_groq import ChatGroq
import os


def llm_config():
   model = ChatGroq(model="llama3-8b-8192",api_key=os.getenv("GROQ_API_KEY"),temperature=0.4)
   return model


load_llm = llm_config()