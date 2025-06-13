from typing import TypedDict, List, Dict

class ChatState(TypedDict):
    symptoms_input: str
    userSymptoms: List[str]
    user_info :str
    followupQuestions: List[str]  
    user_response: Dict[str, str] 
    finalPrompt:str
    diagnosis_probabilities: List[Dict[str, str]] 
