from sqlalchemy import Boolean, ForeignKey, Table,Column,Integer,String, Text, insert, select
from Backend.tables.add_Chat_tables import engine,meta
from sqlalchemy.exc import IntegrityError


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

with engine.begin() as session:
        check_stmt = select(user_table).where(user_table.c.email == "aymaan@example.com")
        result = session.execute(check_stmt).first()

        if not result:
            try:
                stmt = insert(user_table).values(
                    email="aymaan@example.com",
                    password_hash="hashed_password_here",
                    username="aymaan",
                    is_verified=True,
                    last_selected_thread_id=1
                )
                session.execute(stmt)
            except IntegrityError:
                print("User already exists")