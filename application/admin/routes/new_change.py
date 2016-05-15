# coding: utf-8

import webapp2
import json

from application.common import BaseHandler

from ..templates import environment

class NewChange(BaseHandler):
    def get(self):
        template = environment.get_template('new_change.htm')
        self.response.write(template.render())
