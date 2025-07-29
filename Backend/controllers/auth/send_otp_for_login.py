from http.client import HTTPException
import traceback
import resend
from models.auth_model import LoginRequest 

from utils import generate_otp

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