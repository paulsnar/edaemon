# coding: utf-8

import logging
import webapp2
import json

class BaseHandler(webapp2.RequestHandler):
    def jsonify(self, **kwargs):
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.write(json.dumps(kwargs))

    def handle_exception(self, exception, debug):
        logging.exception(exception)

        ret = dict()
        ret['code'] = 500
        if isinstance(exception, webapp2.HTTPException):
            ret['code'] = exception.code

        if debug:
            ret['message'] = str(exception)

        ret['error'] = True
        self.response.set_status(ret['code'])
        self.jsonify(**ret)
