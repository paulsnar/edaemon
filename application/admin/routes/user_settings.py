# coding: utf-8

from application.common import BaseHandler

from ..templates import environment

class UserSettings(BaseHandler):
    def get(self):
        template = environment.get_template('user_settings.htm')
        self.response.write(template.render())
