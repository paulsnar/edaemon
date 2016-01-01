# coding: utf-8

import webapp2

from .handler import Handler
from ....utility.version import get as get_version
import urllib2
import os

class CheckUpdates(Handler):
    def get(self):
        current_version = tuple(
            os.environ['EDAEMON_VERSION'].split('-')[0].split('.'))
        try:
            latest_version = get_version()
            self.jsonify(current_version=current_version,
                latest_version=latest_version)
        except urllib2.HTTPError:
            self.response.set_status(503)
            self.jsonify(error=True, code=503,
                message='Service Unavailable')

meta_routes = [
    ('/api/check_updates', CheckUpdates),
]
