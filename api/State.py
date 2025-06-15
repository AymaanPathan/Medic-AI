# models.py

from pydantic import BaseModel
from typing import List, Dict

class InitInput(BaseModel):
    session_id: str
    userSymptoms: str

class UserInfoInput(BaseModel):
    session_id: str
    user_info: str

class FollowupInput(BaseModel):
    session_id: str
    user_info: str
    userSymptoms: str

class FollowupAnswers(BaseModel):
    session_id: str
    user_response: Dict[str, str]

class FinalPromptInput(BaseModel):
    session_id: str
    userSymptoms: List[str]
    user_info: str
    formatted_response: str
    followupQuestions: List[str]   

class DiagnosisInput(BaseModel):
    session_id: str
    finalPrompt: str
