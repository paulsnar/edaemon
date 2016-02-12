# coding: utf-8

import webapp2
import json

from .handler import Handler
from ....utility.version import update as refresh_version

class CheckUpdates(Handler):
    def get(self):
        refresh_version()
        self.jsonify(message='Thanks')

cron_routes = [
    (r'/api/cron/check_updates', CheckUpdates),
]
