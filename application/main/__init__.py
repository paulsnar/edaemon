# coding: utf-8

from application.common import config as common_config, default_404_handler
from .routes import all_routes as main_routes
import webapp2

wsgi_app = webapp2.WSGIApplication(routes=main_routes, config=common_config)
wsgi_app.error_handlers[404] = default_404_handler
