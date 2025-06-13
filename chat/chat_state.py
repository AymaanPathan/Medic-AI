from typing import TypedDict, List, Dict

class ChatState(TypedDict):
    userSymptoms: List[str]
    user_info :str
    followupQuestions: Dict[str, List[str]]  
    user_response:str
    finalPrompt:str
    diagnosis_probabilities: List[Dict[str, str]] 
