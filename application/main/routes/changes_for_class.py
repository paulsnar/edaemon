# coding: utf-8

import webapp2

from application.common import BaseHandler
from application.common.models import Change

from ..templates import environment

class ChangesForClass(BaseHandler):
    def get(self, for_class):
        rss_token = self.rss_dance()

        template = environment.get_template('changes_for_class.htm')
        changes = Change.get_week_for_class(for_class)
        self.response.write(template.render(
            changes=changes, for_class=for_class, rss_token=rss_token))
