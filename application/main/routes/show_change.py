# coding: utf-8

import webapp2
from google.appengine.ext import ndb
import logging
import json

from application.common import BaseHandler

from ..templates import environment

class ShowChange(BaseHandler):
    def get(self, change_id):
        try:
            change_key = ndb.Key(urlsafe=change_id)
            change = change_key.get()
            if change is None:
                return webapp2.abort(404)
            template = environment.get_template('main/show_change.htm')
            self.response.write(template.render(change=change,
                lessons=json.loads(change.lessons)))
        except Exception, e:
            raise e
