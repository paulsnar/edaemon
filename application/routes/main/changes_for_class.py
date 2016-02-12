# coding: utf-8

import webapp2

from ..handler import Handler
from ...environment import env
from ...models import Change

class ChangesForClass(Handler):
    def get(self, for_class):
        template = env.get_template('main/changes_for_class.htm')
        changes = Change.get_week_for_class(for_class)
        self.response.write(template.render(
            changes=changes, for_class=for_class))
