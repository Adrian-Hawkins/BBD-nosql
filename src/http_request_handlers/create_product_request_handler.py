import tornado
from common.db import Database
from commands.create_order import CreateOrder


class CreateProductRequestHandler(tornado.web.RequestHandler):
    def get(self):
        db = Database()
        # users = db.query('SELECT * FROM users')
        command = CreateOrder()
        command.execute()
        self.write({
            "success": True,
            "data": "users"
        })
