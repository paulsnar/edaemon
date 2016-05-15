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

    class collection_method(object):
        def __init__(self, kind, **kwargs):
            self.kind = kind
            self.config = kwargs

        def __call__(higher_self, f):
            def wrapped(self, *args, **kwargs):
                print args, kwargs
                collection, projection = f(self, *args, **kwargs)
                kind = higher_self.kind

                try:
                    if 'default_page_size' in higher_self.config:
                        default_page_size = higher_self.config['default_page_size']
                    else:
                        default_page_size = 15
                    if hasattr(self, 'max_page_size'):
                        max_page_size = higher_self.config['max_page_size']
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
            return wrapped

    class item_method(object):
        def __init__(self, kind, **kwargs):
            self.kind = kind
            self.config = kwargs

        def __call__(higher_self, f):
            def wrapped(self, *args, **kwargs):
                item = f(self, *args, **kwargs)
                kind = higher_self.kind

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
                            kind=kind,
                            item=result.to_dict(),
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
            return wrapped
