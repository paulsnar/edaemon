# coding: utf-8

import webapp2

from application.common import BaseHandler, json_dumps
from application.common.models import Change

from ..templates import environment

class AdminIndex(BaseHandler):
    def get(self):
        template = environment.get_template('index.htm')
        changes = Change.get_week().order(Change.for_date, Change.for_class)
        self.response.write(
            template.render(
                changes_json=json_dumps([change.to_dict() for change in changes])
            )
        )
