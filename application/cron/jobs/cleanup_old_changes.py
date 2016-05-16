# coding: utf-8

from datetime import date, timedelta

from application.common.models import Change

def run():
    earliest = date.today() - timedelta(days=7)
    purgable = Change.query(Change.for_date < earliest)
    purgable.map(lambda i: i.key.delete())
