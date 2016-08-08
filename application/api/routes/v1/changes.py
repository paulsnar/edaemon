# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor
from google.appengine.api import users
from google.appengine.ext import ndb
from datetime import date

from ..handler import BaseHandler
from application.common.models import Change
from application.utility.dates import ISO8601
from application.utility.lesson import lesson_pipeline

class AllChanges(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self):
        return Change.get_week(), [Change.for_class, Change.for_date]

    @BaseHandler.wrap_exception
    def post(self):
        if not users.get_current_user():
            self.fail(401, 'Authorization is required to access this resource.')
            return
        elif not users.is_current_user_admin():
            self.fail(403,
                'Administrative privileges are required to access this resource.')
            return

        data = json.loads(self.request.body)
        if 'items' in data:
            # old-style non-REST multiple submission endpoint
            # { for_date: …, items: [ { for_class: …, lessons: [ … ] } ] }
            if not ISO8601.is_valid(data['for_date']):
                self.fail(400, 'Invalid date')
                return
            else:
                common_date = ISO8601.parse(data['for_date'])
            resp = dict()
            for change_item in data['items']:
                lessons = lesson_pipeline(change_item['lessons'])
                c = Change(for_class=change_item['for_class'],
                    for_date=common_date,
                    lessons=json.dumps(lessons))
                c.put()
                resp[c.for_class] = c.key.urlsafe()
            self.jsonify(
                success=True,
                kind='Change',
                items=resp
            )
        else:
            # single submission (new frontend)
            # { for_date: …, for_class: …, lessons: [ … ] }
            if not ISO8601.is_valid(data['for_date']):
                self.fail(400, 'Invalid date')
                return
            else:
                for_date = ISO8601.parse(data['for_date'])

            lessons = lesson_pipeline(data['lessons'])
            c = Change(for_class=data['for_class'],
                for_date=for_date,
                lessons=json.dumps(lessons))
            c.put()
            self.jsonify(id=c.key.urlsafe())

class SpecificChange(BaseHandler):
    @BaseHandler.item_method('Change')
    def get(self, change_id):
        return lambda: ndb.Key(urlsafe=change_id).get()

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
            change_key = ndb.Key(urlsafe=change_id)
        except Exception:
            self.fail(400, 'Your request was malformed.')
            return

        change = change_key.get()
        if change is None:
            self.fail(404, 'This change doesn\'t exist.')
            return
        change.purgeable_since = date.today()
        change.put()
        self.jsonify(success=True)

    @BaseHandler.wrap_exception
    def put(self, change_id):
        if not users.get_current_user():
            self.fail(401, 'Authorization is required to access this resource.')
            return
        elif not users.is_current_user_admin():
            self.fail(403,
                'Administrative privileges are required to access this resource.')
            return

        try:
            change_key = ndb.Key(urlsafe=change_id)
        except Exception:
            self.fail(400, 'Your request was malformed.')
            return

        change = change_key.get()
        if change is None:
            self.fail(404, 'This change doesn\'t exist.')
            return
        data = json.loads(self.request.body)
        # { for_date: …, for_class: …, lessons: [ … ] }
        if 'for_class' in data:
            change.for_class = data['for_class']
        if 'for_date' in data:
            if not ISO8601.is_valid(data['for_date']):
                self.fail(400, 'Invalid date')
                return
            else:
                change.for_date = ISO8601.parse(data['for_date'])
        if 'lessons' in data:
            change.lessons = json.dumps(lesson_pipeline(data['lessons']))
        change.put()
        self.jsonify(success=True)

class ChangesForClass(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self, class_name):
        return Change.get_week_for_class(class_name), [Change.for_date]

class ChangesForDate(BaseHandler):
    @BaseHandler.collection_method('Change')
    def get(self, date):
        date = ISO8601.parse(date)
        return Change.get_for_date(date), [Change.for_class]
