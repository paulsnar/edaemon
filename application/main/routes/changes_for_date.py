# coding: utf-8

import webapp2

from application.common import BaseHandler
from application.common.models import Change
from application.utility.dates import ISO8601

from ..templates import environment

class ChangesForDate(BaseHandler):
    def get(self, date):
        date = ISO8601.parse(date)
        template = environment.get_template('changes_for_date.htm')
        changes = Change.get_for_date(date)
        self.response.write(template.render(
            changes=changes,
            date=date))
