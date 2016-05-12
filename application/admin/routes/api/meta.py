# coding: utf-8

import webapp2

from application.version import EDAEMON_VERSION

from .handler import BaseHandler
from application.utility.version import get as get_version
import urllib2
import os

class CheckUpdates(BaseHandler):
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
    (r'/admin/api/check_updates', CheckUpdates),
]
