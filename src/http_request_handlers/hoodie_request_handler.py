import tornado
from commands.create_hoodie import CreateHoodie


class HoodieRequestHandler(tornado.web.RequestHandler):
    def post(self):
        try:
            req = self.request.body
            name: str = req.name
            price: float = req.price
            details: object = req.details
            command = CreateHoodie()
            command.execute(name, price, details)
            self.write({
                "message": "success"
            })
        except Exception as ex:
            self.write({
                "message": "something broke"
            })
