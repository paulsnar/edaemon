# coding: utf-8

from google.appengine.api import memcache
import urllib2
import json

def update():
    req = urllib2.Request(
        'https://api.github.com/repos/paulsnar/edaemon/git/refs/tags')
    req.add_header('Accept', 'application/vnd.github.v3+json')
    resp = urllib2.urlopen(req)
    body = resp.read()
    refs = json.loads(body)
    latest_v = (0, 0, 0)
    for ref in refs:
        refname = ref['ref'] # refs/tags/vX.X OR refs/tags/vX.X.X
        ver = tuple(refname.split('/')[2].split('-')[0][1:].split('.'))
        if ver > latest_v:
            latest_v = ver
    memcache.add('_meta:version', latest_v, 12 * 60 * 60)
    return latest_v

def get():
    cached = memcache.get('_meta:version')
    if cached is None:
        return update()
    else:
        return cached
