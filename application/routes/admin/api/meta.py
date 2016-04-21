# coding: utf-8

import webapp2

from ....version import EDAEMON_VERSION

from .handler import Handler
from ....utility.version import get as get_version
import urllib2
import os

class CheckUpdates(Handler):
    def get(self):
        current_version = tuple(EDAEMON_VERSION.split('-')[0].split('.'))
        is_staging = EDAEMON_VERSION.split('-')[1] == 'staging'
        try:
            latest_version = get_version()
            self.jsonify(current_version=current_version,
                latest_version=latest_version,
                is_staging=is_staging)
        except urllib2.HTTPError:
            self.response.set_status(503)
            self.jsonify(error=True, code=503,
                message='Service Unavailable')

meta_routes = [
    (r'/api/check_updates', CheckUpdates),
]
