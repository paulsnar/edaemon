# coding: utf-8

import webapp2

from application.common import BaseHandler
from application.common.models import Change
from application.utility import unique

from google.appengine.ext.db import NeedIndexError

from ..templates import environment

class AllChanges(BaseHandler):
    def get(self):
        try:
            template = environment.get_template('all_changes.htm')
            changes = Change.get_week()
            classNames = sorted(unique(changes, 'for_class', attr=True))
            dates = sorted(unique(changes, 'for_date', attr=True))
            self.response.write(template.render(
                changes=None,
                classNames=classNames,
                dates=dates))
        except NeedIndexError:
            template = environment.get_template('errors/index_not_ready.htm')
            self.response.write(template.render(_empty_navbar=True))
