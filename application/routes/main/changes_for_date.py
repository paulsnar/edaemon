# coding: utf-8

import webapp2

from ..handler import Handler
from ...environment import env
from ...models import Change

class ChangesForDate(Handler):
    def get(self, date):
        template = env.get_template('main/changes_for_date.htm')
        changes = Change.get_for_date(date)
        self.response.write(template.render(
            changes=changes,
            date=date))
