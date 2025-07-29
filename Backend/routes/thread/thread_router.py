from fastapi import APIRouter
from Backend.utils.engine import engine
from Backend.tables.chat_thread_table import chat_thread
from Backend.tables.chat_messages_table import chat_messages
from datetime import datetime
from sqlalchemy import select,asc
router = APIRouter(prefix="/threads",tags=["threads"])

@router.post("/saveInitialThread")
async def createInitialThread():
    with engine.begin() as connection:
     result = connection.execute(   
        chat_thread.insert().values(user="ap", created_at=datetime.now())
      )
    inserted_id = result.inserted_primary_key[0]
    return {"inserted_id": inserted_id}


@router.get("/getInitalThread")
async def get_initial_thread():
    from sqlalchemy import select, asc
    with engine.connect() as connection:
        stmt = select(chat_thread).order_by(asc(chat_thread.c.id)).limit(1)
        result = connection.execute(stmt).mappings().fetchone()

        if result:
          return result
        return {"message": "No thread found"}
