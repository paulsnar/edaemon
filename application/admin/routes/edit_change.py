# coding: utf-8

import webapp2
import json

from application.common import BaseHandler
from google.appengine.ext import ndb

from ..templates import environment

class EditChange(BaseHandler):
    def get(self, change_id):
        template = environment.get_template('edit_change.htm')
        change = ndb.Key(urlsafe=change_id).get()
        if change is None:
            self.response.set_status(404)
            self.response.write(
                template.render(not_found=True)
            )
        else:
            self.response.write(
                template.render(change_json=json.dumps(change.to_dict()))
            )
