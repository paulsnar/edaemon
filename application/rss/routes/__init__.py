# coding: utf-8

import logging
import webapp2

from application.common.models import User
from ..utility import Feed

class BaseHandler(webapp2.RequestHandler):
    def feed(self, title='', description='', url='', items=[]):
        self.response.headers['Content-Type'] = \
            'application/rss+xml; charset=utf-8'

        feed = Feed()
        feed.title = title
        feed.description = description
        feed.link = url
        map(lambda item: feed.add_item(*item), items)
        body = feed.render()

        self.response.write(
            '<?xml version="1.0" encoding="utf-8"?>' + body)


    def handle_exception(self, exception, debug):
        logging.exception(exception)

    def dispatch(self):
        if not 'token' in self.request.GET:
            return self.abort(401)

        user = User.find_by_rss_token(self.request.GET['token'])
        if not user:
            return self.abort(403)

        if user.rss_token_disabled:
            return self.abort(403)

        return super(BaseHandler, self).dispatch()


from .all_changes_feed import AllChangesFeed
from .class_changes_feed import ClassChangesFeed

all_routes = [
    (r'/feeds/changes/all.xml', AllChangesFeed),
    (r'/feeds/changes/for_class/([0-9A-Za-z\.]+).xml', ClassChangesFeed),
]
