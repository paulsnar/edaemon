# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor
from google.appengine.api import users
from google.appengine.ext import ndb
from functools import partial

from ..handler import BaseHandler
from application.common.models import Change
from application.utility.dates import ISO8601_parse

class AllChanges(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self):
        return Change.get_week(), [Change.for_class, Change.for_date]

class SpecificChange(BaseHandler):
    @BaseHandler.item_method('Change')
    def get(self, change_id):
        return partial(Change.lookup_url, change_id)

    @BaseHandler.wrap_exception
    def delete(self, change_id):
        if not users.get_current_user():
            self.fail(401, 'Authorization is required to access this resource.')
            return
        elif not users.is_current_user_admin():
            self.fail(403,
                'Administrative privileges are required to access this resource.')
            return

        try:
            change = ndb.Key(urlsafe=change_id)
        except Exception:
            self.fail(400, 'Your request was malformed.')
            return

        change.delete()
        self.jsonify(success=True)

class ChangesForClass(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self, class_name):
        return Change.get_week_for_class(class_name), [Change.for_date]

class ChangesForDate(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self, date):
        date = ISO8601_parse(date)
        return Change.get_for_date(date), [Change.for_class]
