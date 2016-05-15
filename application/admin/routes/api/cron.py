# coding: utf-8

import webapp2
import json

from .handler import BaseHandler
from application.utility.version import update as refresh_version

class CheckUpdates(BaseHandler):
    def get(self):
        refresh_version()
        self.jsonify(message='Thanks')

cron_routes = [
    (r'/admin/api/cron/check_updates', CheckUpdates),
]
