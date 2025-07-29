import random
import string
from pydantic import BaseModel
import resend
import traceback

from fastapi import APIRouter, HTTPException
router = APIRouter()
resend.api_key ="re_haXixXK1_L1ypziDWHD76wpERRVQ1RD1B"

class LoginRequest(BaseModel):
    email: str

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))


otp = generate_otp()

def generateEmailParams(email:str):

    params: resend.Emails.SendParams = {
        "from": "Acme <onboarding@resend.dev>",
        "to": [email],    
        "subject": otp,
        "html": "<strong>it works!</strong>",
    }
    return params

@router.post("/auth/send-otp")
async def request_login(data: LoginRequest):
    try:
        cleaned_email = data.email.strip()
        otp = generate_otp()
        email = resend.Emails.send({
            "from": "Acme <onboarding@resend.dev>",
            "to": [cleaned_email],
            "subject": "Your OTP",
            "html": f"<strong>Your OTP is: {otp}</strong>",
        })
        print("email send",email)

    except Exception as e:
        print(e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"msg": "OTP sent to your email"}

