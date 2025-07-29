from sqlalchemy import Table,Column,Integer,String,DateTime,func,ForeignKey,Enum
from Backend.utils.engine import meta


message_type_enum= Enum("A.I","User",name="message_type", create_type=True)



chat_messages = Table(
    "chat_messages",
    meta,
    Column('thread_id',Integer,ForeignKey("chat_thread.id",ondelete="CASCADE"),nullable=False),
    Column('message',String),
    Column('sender',message_type_enum,nullable=False),
    Column('time_stamp',DateTime,default=func.now())
)




