from fastapi import APIRouter

router = APIRouter(prefix="/chats",tags=["chats"])
@router.get("/getAll")
async def get_all_chats():
     return {"message": "Here are your chats"}


