import psycopg2
import psycopg2.extras
import uuid
import json
from datetime import datetime

class ChatStorage:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname="medical_assistant",
            user="postgres",            
            password="aymaan",    
            host="localhost",
            port="5432"
        )