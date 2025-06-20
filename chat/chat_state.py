from typing import TypedDict, List, Dict

class ChatState(TypedDict):
    symptoms_input: str
    userSymptoms: str
    followupQuestions: List[str]  
    user_response: Dict[str, str] 
    finalPrompt:str
    diagnosis_probabilities: str
