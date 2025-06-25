from typing import List, Optional, TypedDict
from langchain_core.messages import BaseMessage

class chat_interface_state(TypedDict, total=False):
    messages: List[BaseMessage]   
    latest_user_message: Optional[str]
    user_info: dict  
    symptoms: List[str]
    medications_taken: List[str]
    medical_history: List[str]

    