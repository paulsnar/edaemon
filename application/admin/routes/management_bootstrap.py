# coding: utf-8

import webapp2

from application.common import BaseHandler

from ..templates import environment

class ManagementBootstrap(BaseHandler):
    def get(self):
        template = environment.get_template('management_bootstrap.htm')
        self.response.write(template.render())
