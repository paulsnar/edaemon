# coding: utf-8

from datetime import date, timedelta

from application.common.models import Change

def run():
    earliest = date.today() - timedelta(days=3)
    purgable = Change.query(Change.purgeable_since != None,
        Change.purgeable_since < earliest)
    purgable.map(lambda i: i.key.delete())
