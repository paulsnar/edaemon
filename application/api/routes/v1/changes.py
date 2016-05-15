# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor

from ..handler import BaseHandler
from application.common.models import Change

class AllChanges(BaseHandler):
    def get(self):
        return self.collection_method(
            collection=Change.get_all(), 
            kind='Change',
            projection=[Change.for_class, Change.for_date]
        )

class SpecificChange(BaseHandler):
    def get(self, change_id):
        try:
            change = Change.lookup_url(change_id)
            if change is None:
                self.response.response.set_status(404)
                self.jsonify(
                    success=False,
                    error=True,
                    code=404,
                    kind='Change',
                    item=None
                )
            else:
                self.jsonify(
                    success=True,
                    kind='Change',
                    item=change.to_dict(),
                    request_meta=dict()
                )
        except Exception:
            self.response.set_status(500)
            self.jsonify(
                success=False,
                error=True,
                code=500,
                message='Server-side error'
            )
            raise

class ChangesForClass(BaseHandler):
    def get(self, class_name):
        return self.collection_method(
            collection=Change.get_for_class(class_name),
            kind='Change',
            projection=[Change.for_date]
        )

class ChangesForDate(BaseHandler):
    def get(self, date):
        return self.collection_method(
            collection=Change.get_for_date(date),
            kind='Change',
            projection=[Change.for_class]
        )
