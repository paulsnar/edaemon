# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor

from .handler import Handler
from ....models import Change
from ....utility.lesson import trim_trailing_nulls
from ....utility.dates import check_ISO8601_compliance

class Changes(Handler):
    def post(self):
        data = json.loads(self.request.body)
        # { date: date, changes: [ className: .., lessons: [ ... ] ] }
        ret = dict()
        changes = data['changes']
        for change in changes:
            if not check_ISO8601_compliance(data['date']):
                self.response.set_status(400)
                self.jsonify(error=True, code=400, message='Invalid date ' +
                    '(for class {0})'.format(change['className']))
                return # stop processing immediately
            else:
                stored_change = Change(for_class=change['className'],
                    for_date=data['date'])
                stored_change.lessons = json.dumps(
                    trim_trailing_nulls(change['lessons']))
                stored_change.put()
                ret[change['className']] = stored_change.key.urlsafe()
        self.jsonify(success=True, stored=ret)

class AllChanges(Handler):
    def get(self):
        if self.request.get('cursor'):
            c = Cursor(urlsafe=self.request.get('cursor'))
            changes, next_c, more = Change.get_all().fetch_page(15,
                start_cursor=c, projection=[Change.for_class, Change.for_date])
        else:
            changes, next_c, more = Change.get_all().fetch_page(15,
                projection=[Change.for_class, Change.for_date])
        ret = dict()
        ret['changes'] = [change.to_dict() for change in changes]
        if more and next_c:
            ret['cursor'] = next_c.urlsafe()
        self.jsonify(**ret)

class ChangesForWeek(Handler):
    def get(self):
        changes = Change.get_week().fetch()
        # changes = [change.to_dict() for change in Change.get_week().fetch()]
        self.jsonify(changes=[change.to_dict() for change in changes])

class SpecificChange(Handler):
    def get(self, change_id):
        try:
            change = Change.lookup_url(change_id)
            if change is None:
                self.response.set_status(404)
                self.jsonify(error=True, code=404, message='Not found')
            else:
                self.jsonify(change=change.to_dict())
        except Exception:
            self.response.set_status(400)
            self.jsonify(error=True, code=400, message='Malformed request')

    def delete(self, change_id):
        try:
            change = Change.lookup_url(change_id)
            if change is None:
                self.response.set_status(404)
                self.jsonify(error=True, code=404, message='Not found')
            else:
                change.key.delete()
                self.jsonify(success=True)
        except Exception:
            self.response.set_status(400)
            self.jsonify(error=True, code=400, message='Malformed request')

changes_routes = [
    ('/api/changes', Changes),
    ('/api/changes/all', AllChanges),
    ('/api/changes/week', ChangesForWeek),
    ('/api/changes/([0-9A-Za-z\-]+)', SpecificChange),
]
