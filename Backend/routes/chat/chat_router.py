from fastapi import APIRouter,Query
from Backend.tables.add_Chat_tables import engine
from Backend.tables.add_Chat_tables import chat_messages,chat_thread
from sqlalchemy import select

router = APIRouter(prefix="/chats",tags=["chats"])
@router.get("/getAll")
async def get_all_chats():
     return {"message": "Here are your chats"}



    

@router.get("/getChatByThreadId")
async def get_chat_by_thrad_id(threadId:int = Query(...)):
     with engine.begin() as connection:
          findMessages = select(chat_messages).where(chat_messages.c.thread_id==threadId).order_by(chat_messages.c.time_stamp.asc())
          result = connection.execute(findMessages).mappings().fetchall()
          return result



