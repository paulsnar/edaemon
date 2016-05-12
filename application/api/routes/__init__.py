# coding: utf-8

from .handler import BaseHandler
class ApiWelcome(BaseHandler):
    def get(self):
        self.jsonify(
            success=True,
            message='Edaemon API welcomes you',
            highest_version=1
        )

all_routes = [
    (r'/api/', ApiWelcome)    
]

from .v1 import v1_routes

all_routes += v1_routes
