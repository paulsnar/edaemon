# coding: utf-8

from .handler import BaseHandler

class ApiWelcome(BaseHandler):
    def get(self):
        self.jsonify(
            success=True,
            message='Edaemon API welcomes you',
            current_version=1
        )
