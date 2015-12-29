# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor

from .handler import Handler
from ....models import Timetable

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
    ('/api/timetables/all', AllTimetables),
]
