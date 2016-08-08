# coding: utf-8

import webapp2

from application.common import BaseHandler, json_dumps
from application.common.models import Change

from ..templates import environment

class AllChanges(BaseHandler):
    def get(self):
        template = environment.get_template('all_changes.htm')
        changes = Change.get_all().order(Change.for_date, Change.for_class)
        self.response.write(
            template.render(
                has_changes=changes.count(limit=1) > 0,
                changes=changes,
                changes_json=json_dumps([change.to_dict() for change in changes])
            )
        )
