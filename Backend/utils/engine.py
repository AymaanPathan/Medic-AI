import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, MetaData,Table,Column,Integer,String,DateTime,func,ForeignKey,Enum
meta = MetaData()

# config
hostName = os.getenv("HOSTNAME")
dataBase = os.getenv("DATABASE")
userName = os.getenv("USERNAME")
pwd = os.getenv("PASSWORD")
port_id = os.getenv("PORT_ID")

DATABASE_URL = f"postgresql+psycopg2://{userName}:{pwd}@{hostName}:{port_id}/{dataBase}"
engine = create_engine(DATABASE_URL)





