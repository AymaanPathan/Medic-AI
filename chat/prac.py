# Streaming
from langchain_groq import ChatGroq 

llm  =ChatGroq(
    model="llama3-8b-8192",
    temperature=0.4
)

for chunk in llm.stream("write me a poem"):
    print(chunk.content,end="",flush=True)