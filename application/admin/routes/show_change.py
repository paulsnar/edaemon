# coding: utf-8

import webapp2
import json

from application.common import BaseHandler
from google.appengine.ext import ndb

from ..templates import environment

class ShowChange(BaseHandler):
    def get(self, change_id):
        try:
            template = environment.get_template('show_change.htm')
            change = ndb.Key(urlsafe=change_id).get()
            if change is None:
                self.response.set_status(404)
                self.response.write(
                    template.render(not_found=True)
                )
            else:
                self.response.write(
                    template.render(change=change,
                        lessons=json.loads(change.lessons))
                )

        except Exception:
            raise # ?
