from fastapi import APIRouter
from sqlalchemy import select
from Backend.tables.user_table import user_table
from Backend.utils.engine import engine


router = APIRouter(prefix="/users",tags=["Users"])


@router.get("/getCurrentThreadId")
async def get_user_current_threadId():
    get_user_thread_id = select(user_table.c.last_selected_thread_id)
    with engine.begin() as connection:
        result = connection.execute(get_user_thread_id).mappings().fetchone()
        return result