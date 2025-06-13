from typing import TypedDict, List, Dict

class MedicalAnalysis(TypedDict):
    Additional_questions:List[str]
    user_response:str
    diagnosis_probabilities: List[Dict[str, str]] 
    risk_remedies: List[str]
    moderate_remedies: List[str]
    safe_remedies: List[str]
    medicine_explanation: Dict[str, str]
