# coding: utf-8

import re
from datetime import date, timedelta

class ISO8601(object):
    @staticmethod
    def parse(_date):
        return date(int(_date[0:4]), int(_date[5:7]), int(_date[8:10]))

    @staticmethod
    def is_valid(_date):
        if re.search(r'\d{4}-\d{2}-\d{2}', _date):
            return True
        else:
            return False

def human_diff_dates(_date):
    years_pl = (u'gada', u'gadiem')
    months_pl = (u'mēneša', u'mēnešiem')
    days_pl = (u'dienas', u'dienām')

    before = u'pirms'
    after = u'pēc'

    args = [ ]

    today = date.today()
    delta = _date - today

    days = delta.days
    if days < 0:
        args.append(before)
        days = -days
    elif days == 0:
        return u'šodien'
    else:
        args.append(after)

    args.append(str(days))

    if days >= 365:
        years = round(days / 365.0)
        args.pop()
        args.append(int(years))
        if years == 1 or \
            (years % 10 == 1 and not years == 11):
            args.append(years_pl[0])
        else:
            args.append(years_pl[1])
    elif days >= 30:
        months = round(days / 30.0)
        args.pop()
        args.append(int(months))
        if months == 1 or \
            (months % 10 == 1 and not months == 11):
            args.append(months_pl[0])
        else:
            args.append(months_pl[1])
    else:
        if days == 1 or \
            (days % 10 == 1 and not days == 11):
            args.append(days_pl[0])
        else:
            args.append(days_pl[1])

    return u'{0} {1} {2}'.format(*args)
