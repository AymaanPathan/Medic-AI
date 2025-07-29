from fastapi import APIRouter, HTTPException
from controllers.auth.send_otp_for_login import request_login
router = APIRouter()
from utils.generate_otp import generate_otp
from models.auth_model import LoginRequest
otp = generate_otp()




@router.post("/auth/send-otp")
async def send_otp(data: LoginRequest):
	return await request_login(data)

