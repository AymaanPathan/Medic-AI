from pydantic import BaseModel
from typing import List, Dict, Optional

class MedicineDetails(BaseModel):
    name: str
    purpose: str 
    how_it_works: str 
    pros: List[str]
    cons: List[str]
    when_not_to_take: List[str]  
    dosage: Dict[str, str] 
    age_restriction: Optional[str]  

class OutPutState(BaseModel):
    diseaseName: str
    diseaseSummary: str 
    whyYouHaveThis: str 
    whatToDoFirst: str  
    medicines: List[MedicineDetails]  
    lifestyleChanges: Optional[List[str]] = [] 
    dangerSigns: Optional[List[str]] = [] 
