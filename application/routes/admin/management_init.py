# coding: utf-8

import webapp2

from ..handler import Handler
from ...environment import env

class ManagementInit(Handler):
    def get(self):
        template = env.get_template('admin/management_init.htm')
        self.response.write(template.render())
