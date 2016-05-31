# coding: utf-8

import webapp2
import json

from application.common import BaseHandler
from application.common.models import Change

from ..templates import environment

class DeletedChanges(BaseHandler):
    def get(self):
        template = environment.get_template('deleted_changes.htm')
        changes = Change.get_deleted().order(Change.purgeable_since,
            Change.for_date, Change.for_class)
        self.response.write(
            template.render(
                changes_json=json.dumps([change.to_dict() for change in changes])
            )
        )
