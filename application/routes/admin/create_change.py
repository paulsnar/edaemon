# coding: utf-8

import webapp2
from webapp2_extras import sessions
from datetime import date
import json

from ..handler import Handler
from ...environment import env
from ...utility import ISO8601_format, generate_xsrf, lesson_utils
from ...models import Change

class CreateChange(Handler):
    def get(self):
        template = env.get_template('admin/create_change.htm')
        xsrf = generate_xsrf()
        today = ISO8601_format(date.today())
        self.session['xsrf'] = xsrf
        self.response.write(template.render(xsrf=xsrf, today=today))

    def post(self):
        template = env.get_template('admin/create_change.htm')
        if self.session.get('xsrf') != self.request.get('_xsrf'):
            xsrf = generate_xsrf()
            today = ISO8601_format(date.today())
            self.session['xsrf'] = xsrf
            self.response.write(template.render(xsrf=xsrf, today=today,
                error=u'Notika XSRF nesakritība'))
            return
        if self.request.get('noscript-submit'):
            lessons = lesson_utils.process_form(self.request)
            for_date = self.request.get('date')
            for_class = self.request.get('class-name')
            change = Change(for_date=for_date, for_class=for_class,
                lessons=json.dumps(lessons))
            change.put()
            self.redirect('/changes/show/{0}'.format(change.key.urlsafe()))
        else:
            self.set_status(501)
            self.jsonify(error='not_implemented')
