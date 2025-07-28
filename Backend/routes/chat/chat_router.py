from fastapi import APIRouter,Query
from Backend.tables.add_Chat_tables import engine
from Backend.tables.add_Chat_tables import chat_messages
from sqlalchemy import label, select
from sqlalchemy import func
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



@router.get("/getFirstUserMessages")
async def get_first_ai_messages():

    # Create a windowed row number
     row_num = func.row_number().over(
          partition_by=chat_messages.c.thread_id,
          order_by=chat_messages.c.time_stamp.desc()
     )

     subquery = select(
        chat_messages.c.thread_id,
        chat_messages.c.message,
        chat_messages.c.sender,
        chat_messages.c.time_stamp,
        label("row_num", row_num)
    ).where(chat_messages.c.sender == 'User').subquery()
     main_query = select(subquery).where(subquery.c.row_num == 1).order_by(subquery.c.time_stamp.desc())
     with engine.begin() as connection:
        result = connection.execute(main_query).mappings().fetchall()
        return result
