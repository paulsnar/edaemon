# coding: utf-8

import webapp2
import logging
from importlib import import_module

class TasksHandler(webapp2.RequestHandler):
    def get(self, task_name):
        try:
            task = import_module('.{0}'.format(task_name), __name__)
            task.perform(self.request, self.response)
        except Exception, e:
            self.response.set_status(500)
            self.response.write('Task handling failed')
            logging.exception(e)

wsgi_app = webapp2.WSGIApplication([
    ('/_tasks/(.*)', TasksHandler)
])
