# coding: utf-8

import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor

from ..handler import BaseHandler
from application.common.models import Change

class AllChanges(BaseHandler):
    def get(self):
        try:
            page_size = 15
            if self.request.get('page_size'):
                try:
                    page_size = int(self.request.get('page_size'))
                    if page_size < 0:
                        page_size = 15
                    elif page_size > 20:
                        page_size = 20
                except ValueError:
                    pass
            if self.request.get('cursor'):
                c = Cursor(urlsafe=self.request.get('cursor'))
                changes, next_c, more = Change.get_all().fetch_page(page_size,
                    start_cursor=c,
                    projection=[Change.for_class, Change.for_date])
            else:
                changes, next_c, more = Change.get_all().fetch_page(page_size,
                    projection=[Change.for_class, Change.for_date])
            
            request_meta = dict(
                page_size=page_size,
                item_count=len(changes)
            )
            if more and next_c:
                request_meta['has_more'] = True
                request_meta['next_cursor'] = next_c.urlsafe()
            else:
                request_meta['has_more'] = False
            
            self.jsonify(
                success=True,
                kind='Change',
                items=[change.to_dict() for change in changes],
                request_meta=request_meta
            )
        except Exception:
            self.response.set_status(500)
            self.jsonify(
                success=False,
                error=True,
                code=500,
                message='Server-side error')
            raise

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
        try:
            page_size = 15
            if self.request.get('page_size'):
                try:
                    page_size = int(self.request.get('page_size'))
                    if page_size < 0:
                        page_size = 15
                    elif page_size > 20:
                        page_size = 20
                except ValueError:
                    pass
            if self.request.get('cursor'):
                c = Cursor(urlsafe=self.request.get('cursor'))
                changes, next_c, more = Change.get_for_class(
                    class_name).fetch_page(page_size,
                    projection=[Change.for_date])
            else:
                changes, next_c, more = Change.get_for_class(
                    class_name).fetch_page(page_size,
                    projection=[Change.for_date])

            request_meta = dict(
                page_size=page_size,
                item_count=len(changes)
            )
            if more and next_c:
                request_meta['has_more'] = True
                request_meta['next_cursor'] = next_c.urlsafe()
            else:
                request_meta['has_more'] = False

            self.jsonify(
                success=True,
                kind='Change',
                items=[change.to_dict() for change in changes],
                request_meta=request_meta
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

class ChangesForDate(BaseHandler):
    def get(self, date):
        try:
            page_size = 15
            if self.request.get('page_size'):
                try:
                    page_size = int(self.request.get('page_size'))
                    if page_size < 0:
                        page_size = 15
                    elif page_size > 20:
                        page_size = 20
                except ValueError:
                    pass
            if self.request.get('cursor'):
                c = Cursor(urlsafe=self.request.get('cursor'))
                changes, next_c, more = Change.get_for_date(
                    date).fetch_page(page_size,
                    projection=[Change.for_class])
            else:
                changes, next_c, more = Change.get_for_date(
                    date).fetch_page(page_size,
                    projection=[Change.for_class])

            request_meta = dict(
                page_size=page_size,
                item_count=len(changes)
            )
            if more and next_c:
                request_meta['has_more'] = True
                request_meta['next_cursor'] = next_c.urlsafe()
            else:
                request_meta['has_more'] = False

            self.jsonify(
                success=True,
                kind='Change',
                items=[change.to_dict() for change in changes],
                request_meta=request_meta
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
