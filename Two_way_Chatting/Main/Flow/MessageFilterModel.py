from pydantic import BaseModel, Field
from langchain_core.output_parsers import PydanticOutputParser

class MessageFilterResponse(BaseModel):
    allowed: bool = Field(..., description="Whether the message is valid or not")
    reason: str = Field(..., description="Short reason for decision")

parser = PydanticOutputParser(pydantic_object=MessageFilterResponse)
