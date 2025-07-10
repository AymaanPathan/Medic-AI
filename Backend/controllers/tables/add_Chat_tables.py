from sqlalchemy import create_engine, MetaData,Table,Column,Integer,String,DateTime,func,ForeignKey,Enum
from datetime import datetime
meta = MetaData()

hostName = "localhost"
dataBase = "medic-ai"
userName = "postgres"
pwd = "aymaan"
port_id = 5432

DATABASE_URL = f"postgresql+psycopg2://{userName}:{pwd}@{hostName}:{port_id}/{dataBase}"
engine = create_engine(DATABASE_URL)


chat_thread = Table(
    "chat_thread",
    meta,
    Column('id',Integer,primary_key=True),
    Column('user',String,nullable=False),
    Column('created_at',DateTime,default=func.now())
)


message_type_enum = Enum("A.I","User",name="message_type", create_type=True)
chat_messages = Table(
    "chat_messages",
    meta,
    Column('thread_id',Integer,ForeignKey("chat_thread.id",ondelete="CASCADE"),nullable=False),
    Column('message',message_type_enum,nullable=False),
    Column('time_stamp',DateTime,default=func.now())
)


meta.create_all(engine)
insert_statement = chat_thread.insert().values(id=1,user="Aymaan",created_at=datetime(2024, 12, 25, 15, 30)) 
with engine.begin() as connection:
    result =connection.execute(insert_statement)