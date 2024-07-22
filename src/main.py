import tornado.ioloop
import tornado.web

from http_request_handlers.create_product_request_handler import CreateProductRequestHandler
from http_request_handlers.helath_request_handler import HealthRequestHandler


def make_app():
    return tornado.web.Application([
        (r"/", CreateProductRequestHandler),
        (r'/health', HealthRequestHandler)
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server listening on http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
