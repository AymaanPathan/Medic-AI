from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Import your chain setup code
from connect_memory_for_llm import ask_question  # adjust path if needed

app = FastAPI()

# Optional: enable CORS if calling from a frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_route(request: QueryRequest):
    try:
        result = ask_question(request.question)
        return {
            "answer": result["result"],
            "sources": [doc.metadata for doc in result.get("source_documents", [])]
        }
    except Exception as e:
        return {"error": str(e)}
