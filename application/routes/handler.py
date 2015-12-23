# coding: utf-8

import logging
import webapp2
from webapp2_extras import sessions
import json

from ..environment import env

class Handler(webapp2.RequestHandler):
    def dispatch(self):
        self.session_store = sessions.get_store(request=self.request)
        try:
            super(Handler, self).dispatch()
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        return self.session_store.get_session()

    def handle_exception(self, exception, debug):
        logging.exception(exception)
        template = env.get_template('errors/50x.htm')
        code = 500
        if isinstance(exception, webapp2.HTTPException):
            code = exception.code
            if code == 404:
                # reraise for pretty 404 handling
                raise exception
        if debug:
            msg = str(exception)
        else:
            msg = ''
        self.response.write(template.render(debug=debug,
            code=code,
            exception=repr(exception), text=msg))
        self.response.set_status(code)

    def jsonify(self, **kwargs):
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.write(json.dumps(kwargs))
