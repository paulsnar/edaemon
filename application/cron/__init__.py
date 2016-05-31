# coding: utf-8

import webapp2
import logging
from importlib import import_module

class CronHandler(webapp2.RequestHandler):
    def get(self, task_name):
        # self.response.write('Cron')
        try:
            job = import_module('.jobs.{0}'.format(task_name), __name__)
            job.run()
            self.response.write('Cron')
        except Exception, e:
            self.response.set_status(500)
            self.response.write('Cron failed')
            logging.exception(e)


wsgi_app = webapp2.WSGIApplication([
    ('/cron/(.*)', CronHandler)
])
