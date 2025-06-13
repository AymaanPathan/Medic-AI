from pydantic import BaseModel
from typing import Dict, List

class InitInput(BaseModel):
    session_id: str
    userSymptoms: List[str] 

class UserInfoInput(BaseModel):
    session_id: str
    user_info: str

class FollowupAnswers(BaseModel):
    session_id: str
    followupQuestions: List[str]  
    user_response: Dict[str, str]  

class FinalPrompt(BaseModel):
    session_id: str
    finalPrompt:str

