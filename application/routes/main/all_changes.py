# coding: utf-8

import webapp2

from ..handler import Handler
from ...environment import env
from ...models import Change
from ...utility import unique

class AllChanges(Handler):
    def get(self):
        template = env.get_template('main/all_changes.htm')
        changes = Change.get_week()
        classNames = sorted(unique(changes, 'for_class', attr=True))
        dates = sorted(unique(changes, 'for_date', attr=True))
        self.response.write(template.render(
            changes=None,
            classNames=classNames,
            dates=dates))
