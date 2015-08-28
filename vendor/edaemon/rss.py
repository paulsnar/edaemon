# coding: utf-8
from flask import Blueprint, request, make_response
from google.appengine.api.app_identity.app_identity import get_application_id
import re

from .ndbmodels import Change
from .utility.rss import Feed, FeedItem

EXTRACTOR = r'(https?://[0-9a-zA-Z.-]+)(/.*)*/?'

bp = Blueprint('rss', __name__)

@bp.route('/week.xml')
def feed_week():
    base_url = \
        request.url_root[0:re.match(EXTRACTOR, request.url_root).regs[1][1]]
    base_url += '/'

    feed = Feed()
    feed.title = u'Izmaiņas tuvākajā nedēļā - Edaemon'
    feed.link = base_url

    changes = Change.get_week()
    for change in changes:
        fe = FeedItem()
        fe.id = base_url + 'show/' + change.key.urlsafe()
        fe.link = fe.id
        fe.title = u'Izmaiņas {0} klasei ({1})'.format(
            change.className, change.date)
        feed.add_item(fe)

    response = make_response(
        '<?xml version="1.0" encoding="UTF-8" ?>' + feed.render())
    response.headers['Content-Type'] = 'application/rss+xml; charset=utf-8'
    return response

@bp.route('/class/<class_name>/week.xml')
def feed_class_week(class_name):
    base_url = \
        request.url_root[0:re.match(EXTRACTOR, request.url_root).regs[1][1]]
    base_url += '/'

    feed = Feed()
    feed.title = u'Izmaiņas tuvākajā nedēļā {0} klasei - Edaemon'.format(
        class_name)
    feed.link = base_url + '?class_name=' + class_name

    changes = Change.get_week_for_class(class_name)
    for change in changes:
        fe = FeedItem()
        fe.id = base_url + 'show/' + change.key.urlsafe()
        fe.link = fe.id
        fe.title = u'Izmaiņas {0}'.format(change.date)
        feed.add_item(fe)

    response = make_response(
        '<?xml version="1.0" encoding="UTF-8" ?>' + feed.render())
    response.headers['Content-Type'] = 'application/rss+xml; charset=utf-8'
    return response
