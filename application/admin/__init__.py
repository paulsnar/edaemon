# coding: utf-8

from application.common import config as common_config, default_404_handler
import webapp2
from .routes import all_routes as admin_routes

wsgi_app = webapp2.WSGIApplication(routes=admin_routes, config=common_config)
wsgi_app.error_handlers[404] = default_404_handler
