# coding: utf-8

from application.common import BaseHandler
from application.common.models import User
from application.utility.dates import human_diff_dates

from google.appengine.api import users

from ..templates import environment

class Index(BaseHandler):
    def get(self):
        rss_token = self.rss_dance()
        template = environment.get_template('index.htm')

        if users.get_current_user() and rss_token is None:
            user = User.find_by_email(users.get_current_user().email())
            if user.rss_token_ban_expires_at:
                ban_timeout = human_diff_dates(user.rss_token_ban_expires_at)
            else:
                ban_timeout = None
        else:
            ban_timeout = None

        self.response.write(template.render(
            rss_token=rss_token,
            host=self.request.host_url,
            ban_timeout=ban_timeout))
