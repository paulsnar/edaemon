# coding: utf-8

import webapp2

from ..handler import Handler
from ...environment import env
from ...models import Change

class AllChanges(Handler):
    def get(self):
        template = env.get_template('admin/all_changes.htm')
        changes = Change.get_all().fetch()
        self.response.write(template.render(changes=changes))
