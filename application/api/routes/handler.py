# coding: utf-8

import logging
import webapp2
import json
from google.appengine.datastore.datastore_query import Cursor

class BaseHandler(webapp2.RequestHandler):
    def jsonify(self, **kwargs):
        self.response.headers['Content-Type'] = \
            'application/json; charset=utf-8'
        self.response.write(json.dumps(kwargs))

    def handle_exception(self, exception, debug):
        logging.exception(exception)

    def collection_method(self, collection, kind, projection=None):
        try:
            if hasattr(self, 'default_page_size'):
                default_page_size = self.default_page_size
            else:
                default_page_size = 15
            if hasattr(self, 'max_page_size'):
                max_page_size = self.max_page_size
            else:
                max_page_size = 20

            if self.request.get('page_size'):
                try:
                    page_size = int(self.request.get('page_size'))
                    if page_size < 0:
                        page_size = default_page_size
                    elif page_size > max_page_size:
                        page_size = max_page_size
                except ValueError:
                    page_size = default_page_size
            else:
                page_size = default_page_size

            if self.request.get('cursor'):
                c = Cursor(urlsafe=self.request.get('cursor'))
                results, next_c, more = collection.fetch_page(page_size,
                    start_cursor=c,
                    projection=projection)
            else:
                results, next_c, more = collection.fetch_page(page_size,
                    projection=projection)

            request_meta = dict(
                page_size=page_size,
                item_count=len(results)
            )
            if more and next_c:
                request_meta['has_more'] = True
                request_meta['next_cursor'] = next_c.urlsafe()
            else:
                request_meta['has_more'] = False

            self.jsonify(
                success=True,
                kind=kind,
                items=[result.to_dict() for result in results],
                request_meta=request_meta
            )
        except Exception:
            self.response.set_status(500),
            self.jsonify(
                success=False,
                error=True,
                code=500,
                message='Server-side error'
            )
            raise

    def item_method(self, item, kind):
        try:
            result = item()
            if result is None:
                self.response.set_status(404)
                self.jsonify(
                    success=False,
                    error=True,
                    code=404,
                    kind=kind,
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
