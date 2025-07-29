from sqlalchemy import Boolean, DateTime, ForeignKey, Table,Column,Integer,String, Text, func, insert, select
from sqlalchemy.exc import IntegrityError
from Backend.utils.engine import meta

chat_thread = Table(
    "chat_thread",
    meta,
    Column('id',Integer,primary_key=True,autoincrement=True),
    Column('user',String,nullable=False),
    Column('created_at',DateTime,default=func.now())
)