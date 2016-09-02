# coding: utf-8

from . import BaseHandler

from application.common.models import Change
from application.utility.i18n import format_date

class ClassChangesFeed(BaseHandler):
    def get(self, for_class):
        urlbase = self.request.host_url

        changes = Change.get_week_for_class(for_class)
        feed_items = []
        for change in changes:
            item_link = urlbase + '/changes/show/' + change.key.urlsafe()
            feed_items.append(
                (
                    item_link,
                    item_link,
                    u'Izmaiņas {0}'.format(
                        format_date(change.for_date, 'dativs'))
                )
            )

        return self.feed(
            title=u'Izmaiņas {0} klasei'.format(for_class),
            description=u'Izmaiņas {0} klasei'.format(for_class),
            url=urlbase + '/changes/for_class/' + for_class,
            items=feed_items
        )
