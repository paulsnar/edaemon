# coding: utf-8

from application.common import config as common_config
from .routes import all_routes as api_routes
import webapp2
import json

def handle_404(request, response, exception):
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    response.write(json.dumps(dict(
        success=False,
        error=True,
        code=404,
        message='Method not found'
    )))

wsgi_app = webapp2.WSGIApplication(routes=api_routes, config=common_config)
wsgi_app.error_handlers[404] = handle_404
