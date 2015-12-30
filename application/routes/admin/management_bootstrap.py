# coding: utf-8

import webapp2

from ..handler import Handler
from ...environment import env

class ManagementBootstrap(Handler):
    def get(self):
        template = env.get_template('admin/management_bootstrap.htm')
        self.response.write(template.render())
