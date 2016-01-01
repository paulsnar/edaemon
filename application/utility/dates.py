# coding: utf-8

import re
from datetime import date, timedelta

def ISO8601_format(_date):
    return '{0:0>#4}-{1:0>#2}-{2:0>#2}'.format(
        _date.year, _date.month, _date.day)

def check_ISO8601_compliance(_date):
    if re.search(r'\d{4}-\d{2}-\d{2}', _date):
        return True
    else:
        return False

def format_week():
    days = [ ]
    today = date.today()
    day = timedelta(days=1)
    for i in xrange(0, 7):
        days.append(ISO8601_format(today + day * i))
    return days
