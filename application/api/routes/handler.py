# coding: utf-8

import logging
import webapp2
import json

class BaseHandler(webapp2.RequestHandler):
    def jsonify(self, **kwargs):
        self.response.headers['Content-Type'] = \
            'application/json; charset=utf-8'
        self.response.write(json.dumps(kwargs))

    def handle_exception(self, exception, debug):
        logging.exception(exception)
        
