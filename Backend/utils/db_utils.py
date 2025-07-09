import psycopg2

hostName= "localhost"
dataBase = "medic-ai"
userName="postgres"
pwd="aymaan"
port_id =5432

cursor = None
connection = None
try:
    connection = psycopg2.connect(
        host=hostName,
        dbname = dataBase,
        user=userName,
        password=pwd,
        port=port_id
    )

    cursor = connection.cursor()

   
except Exception as error:
    print("Error while connecting to Databse",error)
finally:
    if cursor is not None :
        cursor.close()
    if connection is not None:
        connection.close()


""" Why You Need to Close cursor and connection
When using psycopg2, you're connecting to a live database server (PostgreSQL), and:

connection: opens a session with the database server (holds memory & socket)

cursor: opens a query channel to send/receive SQL operations

If you don't close them, they:

🧠 Hold resources open on your machine AND the database server

🕳️ Cause connection leaks, especially in production

🧯 Can hit max connection limits (too many clients) and crash the app/db

🐛 May leave locks on tables or rows (especially if you're using BEGIN/COMMIT transactions)
"""
