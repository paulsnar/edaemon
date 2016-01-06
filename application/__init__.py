# coding: utf-8

import os
from google.appengine.api import users
import webapp2
import logging

from .environment import env
from .routes import main, admin

def handle_401(request, response, exception):
    template = env.get_template('errors/401.htm')
    response.write(template.render())
    response.set_status(401)

def handle_404(request, response, exception):
    # logging.exception(exception)
    template = env.get_template('errors/404.htm')
    response.write(template.render())
    response.set_status(404)

config = dict()
config['webapp2_extras.sessions'] = dict(
    secret_key=os.environ.get('EDAEMON_COOKIE_KEY'))

main = webapp2.WSGIApplication(main, config=config)
main.error_handlers[404] = handle_404

admin = webapp2.WSGIApplication(admin, config=config)
admin.error_handlers[404] = handle_404
