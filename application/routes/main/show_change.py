# coding: utf-8

import webapp2
from google.appengine.ext import ndb
import logging
import json

from ..handler import Handler
from ...environment import env

class ShowChange(Handler):
    def get(self, change_id):
        try:
            change_key = ndb.Key(urlsafe=change_id)
            change = change_key.get()
            if change is None:
                return webapp2.abort(404)
            # subjects =
            template = env.get_template('main/show_change.htm')
            # return render_template('main/change.htm',
            #     change=change)
            self.response.write(template.render(change=change,
                lessons=json.loads(change.lessons)))
        except Exception, e:
            raise e
            # return webapp2.abort(404)
