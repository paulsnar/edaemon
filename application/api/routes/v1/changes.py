# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor
from functools import partial

from ..handler import BaseHandler
from application.common.models import Change
from application.utility.dates import ISO8601_parse

class AllChanges(BaseHandler):
    def get(self):
        return self.collection_method(
            collection=Change.get_all(), 
            kind='Change',
            projection=[Change.for_class, Change.for_date]
        )

class SpecificChange(BaseHandler):
    def get(self, change_id):
        return self.item_method(
            item=partial(Change.lookup_url, change_id),
            kind='Change'
        )

class ChangesForClass(BaseHandler):
    def get(self, class_name):
        return self.collection_method(
            collection=Change.get_for_class(class_name),
            kind='Change',
            projection=[Change.for_date]
        )

class ChangesForDate(BaseHandler):
    def get(self, date):
        date = ISO8601_parse(date)
        return self.collection_method(
            collection=Change.get_for_date(date),
            kind='Change',
            projection=[Change.for_class]
        )
