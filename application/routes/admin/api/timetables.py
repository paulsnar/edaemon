# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor

from .handler import Handler
from ....models import Timetable

class Timetables(Handler):
    def post(self):
        data = json.loads(self.request.body)
        # { timetables: [ { className: …, lessons: { mon: { 0: …, 1: null, … }, … } }, … ] }
        ret = dict()
        timetables = data['timetables']
        for timetable in timetables:
            stored_timetable = Timetable(for_class=timetable['className'])
            stored_timetable.plan = json.dumps(timetable['lessons'])
            stored_timetable.put()
            ret[timetable['className']] = stored_timetable.key.urlsafe()
        self.jsonify(success=True, stored=ret)

class AllTimetables(Handler):
    def get(self):
        if self.request.get('cursor'):
            c = Cursor(urlsafe=self.request.get('cursor'))
            timetables, next_c, more = Timetable.get_all().fetch_page(15,
                start_cursor=c, projection=[Timetable.for_class])
        else:
            timetables, next_c, more = Timetable.get_all().fetch_page(15,
                projection=[Timetable.for_class])
        ret = dict()
        ret['timetables'] = [timetable.to_dict() for timetable in timetables]
        if more and next_c:
            ret['cursor'] = next_c.urlsafe()
        self.jsonify(**ret)

timetables_routes = [
    ('/api/timetables', Timetables),
    ('/api/timetables/all', AllTimetables),
]
