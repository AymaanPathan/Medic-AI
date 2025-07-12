from sqlalchemy import Boolean, ForeignKey, Table,Column,Integer,String, Text
from add_Chat_tables import  engine ,meta,chat_thread

user_table = Table(
    "users",
    meta,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("email", String(255), unique=True, nullable=False),
    Column("password_hash", Text, nullable=False),
    Column("username", String(100), nullable=True),
    Column("is_verified", Boolean, default=False),
    Column("last_selected_thread_id", Integer, ForeignKey("chat_thread.id",ondelete="CASCADE"), nullable=True),
)

meta.create_all(bind=engine)