# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor
from google.appengine.api import users
from functools import partial

from ..handler import BaseHandler
from application.common.models import Change
from application.utility.dates import ISO8601_parse

class AllChanges(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self):
        return Change.get_week, [Change.for_class, Change.for_date]

class SpecificChange(BaseHandler):
    @BaseHandler.item_method('Change')
    def get(self, change_id):
        return partial(Change.lookup_url, change_id)

class ChangesForClass(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self, class_name):
        return Change.get_week_for_class(class_name), [Change.for_date]

class ChangesForDate(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self, date):
        date = ISO8601_parse(date)
        return Change.get_for_date(date), [Change.for_class]
