# coding: utf-8

import requests
import os
import json
import logging

from application.common.models import Change
from application.utility.dates import ISO8601

def perform(request, response):
    GCMKEY = os.environ.get('EDAEMON_GCM_KEY')
    if request.get('date') == '':
        response.set_status(400)
        response.write('Invalid date')
        return
    date = ISO8601.parse(request.get('date'))
    changes = Change.query(Change.for_date == date,
        Change.purgeable_since == None)
    for change in changes:
        headers = {
            "Authorization": 'key={0}'.format(GCMKEY),
            "Content-Type": 'application/json'
        }
        gcmreq = dict(
            to='/topics/{0}'.format(change.for_class),
            data={
                "change": change.key.urlsafe()
            }
        )
        r = requests.post('http://gcm-http.googleapis.com/gcm/send',
            headers=headers, data=json.dumps(gcmreq))
        resp = r.json()
        if resp.get('error'):
            logging.error('GCM error: {0}'.format(resp['error']))
