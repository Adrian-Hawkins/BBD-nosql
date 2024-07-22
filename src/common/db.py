import os

import psycopg2
from psycopg2.extras import RealDictCursor
from threading import Lock


class Database:
    _instance = None
    _lock = Lock()

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super(Database, cls).__new__(cls)
                    cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # connection_string = "postgresql://admin:admin@localhost:5432/dev"
        connection_string = os.getenv("DB_CONNECTION_STRING")
        self.connection = psycopg2.connect(connection_string)
        self.cursor = self.connection.cursor(cursor_factory=RealDictCursor)

    def query(self, query, params=None):
        self.cursor.execute(query, params or ())
        return self.cursor.fetchall()

    def execute(self, query, params=None):
        self.cursor.execute(query, params or ())
        self.connection.commit()

    def close(self):
        self.cursor.close()
        self.connection.close()
        Database._instance = None

# Usage example:
# db = Database()
