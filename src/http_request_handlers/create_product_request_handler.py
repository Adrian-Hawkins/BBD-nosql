import tornado
from common.db import Database


class CreateProductRequestHandler(tornado.web.RequestHandler):
    def get(self):
        db = Database()
        # users = db.query('SELECT * FROM users')
        self.write({
            "success": True,
            "data": "users"
        })
