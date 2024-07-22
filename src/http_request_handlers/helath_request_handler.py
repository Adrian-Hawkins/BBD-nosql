import tornado


class HealthRequestHandler(tornado.web.RequestHandler):
    def get(self):
        self.write({
            "success": True,
            "data": "healthy"
        })
