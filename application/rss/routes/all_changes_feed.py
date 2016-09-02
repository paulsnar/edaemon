# coding: utf-8

from . import BaseHandler

from application.common.models import Change
from application.utility.i18n import format_date

class AllChangesFeed(BaseHandler):
    def get(self):
        urlbase = self.request.host_url

        changes = Change.get_week()
        feed_items = []
        for change in changes:
            item_link = urlbase + '/changes/show/' + change.key.urlsafe()
            feed_items.append(
                (
                    item_link,
                    item_link,
                    u'Izmaiņas {0}.klasei {1}'.format(change.for_class,
                        format_date(change.for_date, 'dativs'))
                )
            )

        return self.feed(
            title=u'Visas izmaiņas',
            description=u'Visas izmaiņas',
            url=urlbase + '/',
            items=feed_items
        )
