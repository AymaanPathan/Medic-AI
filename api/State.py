# models.py

from pydantic import BaseModel
from typing import List, Dict

class InitInput(BaseModel):
    session_id: str
    userSymptoms: str


class FollowupInput(BaseModel):
    session_id: str
    user_info: str
    userSymptoms: str

class FollowupAnswers(BaseModel):
    session_id: str
    user_response: Dict[str, str]

class FinalPromptInput(BaseModel):
    session_id: str
    userSymptoms: str
    user_info: str
    formatted_response: Dict[str, str]

class FinalPromptOutput(BaseModel):
    final_prompt: str

class DiagnosisInput(BaseModel):
    session_id: str
    finalPrompt: str
