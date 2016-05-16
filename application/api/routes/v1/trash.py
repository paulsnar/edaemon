# coding: utf-8

import webapp2
import json
from google.appengine.api import users
from google.appengine.ext import ndb

from ..handler import BaseHandler
from application.common.models import Change

class TrashHandler(BaseHandler):
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

        if data.get('action') == 'undelete':
            if data.get('kind') == 'Change':
                try:
                    change_key = ndb.Key(urlsafe=data.get('id'))
                except Exception:
                    self.fail(400, 'Your request was malformed.')
                    return

                change = change_key.get()
                if change is None:
                    self.fail(404, 'Can\'t undelete nonexistant item')
                    return
                change.purgeable_since = None
                change.put()
                self.jsonify(success=True)
            else:
                self.fail(400, 'Invalid kind')
                return
        else:
            self.fail(400, 'Invalid action')
            return
