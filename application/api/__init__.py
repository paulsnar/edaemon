# coding: utf-8

from application.common import config as common_config
from .routes import all_routes as api_routes
import webapp2

wsgi_app = webapp2.WSGIApplication(routes=api_routes, config=common_config)
