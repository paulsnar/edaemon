# coding: utf-8

import webapp2
import json
from google.appengine.api import users, taskqueue
from google.appengine.ext import ndb

from ..handler import BaseHandler
from application.common.models import Change

class NotifyHandler(BaseHandler):
    @BaseHandler.wrap_exception
    def post(self):
        if not users.get_current_user():
            self.fail(401, 'Authorization is required to access this resource.')
            return
        elif not users.is_current_user_admin():
            self.fail(403,
                'Administrative privileges are required to access this resource.')
            return

        data = json.loads(self.request.body)

        if data.get('kind') == 'Change':
            if not data.get('date'):
                self.fail(400, 'Date not specified')
                return
            else:
                taskqueue.add(
                    url='/_tasks/notify',
                    params=dict(date=data.get('date'))
                )
                self.jsonify(success=True)
        else:
            self.fail(400, 'Invalid kind')
            return
