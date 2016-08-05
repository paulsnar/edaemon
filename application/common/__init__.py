# coding: utf-8

import os
config = dict()
config['webapp2_extras.sessions'] = dict(
    secret_key=os.environ.get('EDAEMON_COOKIE_KEY'))


from application.version import EDAEMON_VERSION
from google.appengine.api import users
from application.utility.i18n import format_date
common_globals = dict(
    edaemon=dict(
        version=EDAEMON_VERSION
    ),
    users=users,
    format_date=format_date,
    GA_TRACKING_ID=os.environ.get('GA_TRACKING_ID', None)
)


from jinja2 import Environment, PackageLoader
_env = Environment(loader=PackageLoader(__name__, 'error_templates'))
_env.globals = common_globals

import webapp2
from webapp2_extras import sessions
import logging
import json
class BaseHandler(webapp2.RequestHandler):
    def dispatch(self):
        self.session_store = sessions.get_store(request=self.request)
        try:
            super(BaseHandler, self).dispatch()
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        return self.session_store.get_session()

    def handle_exception(self, exception, debug):
        logging.exception(exception)
        template = _env.get_template('50x.htm')
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
        self.response.headers['Content-Type'] = 'application/json; ' \
            'charset=utf-8'
        self.response.write(json.dumps(kwargs))


def default_404_handler(request, response, exception):
    template = _env.get_template('404.htm')
    response.write(template.render())
    response.set_status(404)

import simplejson
def json_dumps(obj):
    return simplejson.encoder.JSONEncoderForHTML().encode(obj)
