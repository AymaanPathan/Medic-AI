import os
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
load_dotenv()


def llm_config():
   model = ChatGroq(model="llama3-8b-8192",api_key=os.getenv("GROQ_API_KEY"),temperature=0.4,streaming=True)
   return model


load_llm = llm_config()


DB_FAISS_PATH = "../../../vectorstore/db_faiss"
vectorstore = FAISS.load_local(DB_FAISS_PATH, HuggingFaceEmbeddings(),  allow_dangerous_deserialization=True)
retriever = vectorstore.as_retriever(search_type="similarity", k=3)

two_way_chatting_qa_chain = RetrievalQA.from_chain_type(
    llm=load_llm,
    retriever=retriever,
    return_source_documents=True,
    chain_type="stuff"
)