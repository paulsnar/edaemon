# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor

from .handler import Handler
from ....models import Timetable

class Timetables(Handler):
    def post(self):
        try:
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
        except Exception:
            self.set_status(500)
            self.jsonify(error=True, code=500, message='Server-side error')
            raise

class AllTimetables(Handler):
    def get(self):
        try:
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
        except Exception:
            self.set_status(500)
            self.jsonify(error=True, code=500, message='Server-side error')
            raise

class SpecificTimetable(Handler):
    def get(self, timetable_id):
        try:
            timetable = Timetable.lookup_url(timetable_id)
            if timetable is None:
                self.response.set_status(404)
                self.jsonify(error=True, code=404, message='Not found')
            else:
                self.jsonify(timetable=timetable.to_dict())
        except Exception:
            self.response.set_status(400)
            self.jsonify(error=True, code=400, message='Malformed request')
            raise

    def delete(self, timetable_id):
        try:
            timetable = Timetable.lookup_url(timetable_id)
            if timetable is None:
                self.response.set_status(404)
                self.jsonify(error=True, code=404, message='Not found')
            else:
                timetable.key.delete()
                self.jsonify(success=True)
        except Exception:
            self.response.set_status(400)
            self.jsonify(error=True, code=400, message='Malformed request')
            raise

    def put(self, timetable_id):
        try:
            timetable = Timetable.lookup_url(timetable_id)
            if timetable is None:
                self.response.set_status(404)
                self.jsonify(error=True, code=400, message='Not found')
            else:
                data = json.loads(self.request.body)
                # data: { className: …, lessons: […, …, …] }
                timetable.for_class = data['className']
                timetable.plan = json.dumps(data['lessons'])
                timetable.put()
                self.jsonify(success=True,
                    timetable=dict(id=timetable.key.urlsafe()))
        except Exception:
            self.response.set_status(400)
            self.jsonify(error=True, code=400, message='Malformed request')
            raise

timetables_routes = [
    (r'/admin/api/timetables', Timetables),
    (r'/admin/api/timetables/all', AllTimetables),
    (r'/admin/api/timetables/([0-9A-Za-z\-_]+)', SpecificTimetable),
]
