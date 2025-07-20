from typing import List
from huggingface_hub import InferenceClient
from langchain_huggingface import HuggingFaceEndpoint
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.output_parsers import RegexParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
load_dotenv()

# Define model and DB path
DB_FAISS_PATH = "../vectorstore/db_faiss"

model_id = "mistralai/Mistral-7B-Instruct-v0.3"
def load_llm(model_name: str = "llama3-8b-8192"):
    llm = ChatGroq(model=model_name, temperature=0.2,streaming=True,
    api_key=os.getenv("GROQ_API_KEY"))
    structured_model = llm
    return structured_model

# Load components
llm = load_llm()



