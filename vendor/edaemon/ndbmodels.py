from datetime import date, timedelta
from google.appengine.ext import ndb
import json

def _format_date_ISO8601(formattableDate):
    return '{0:0>#4}-{1:0>#2}-{2:0>#2}'.format(
        formattableDate.year, formattableDate.month, formattableDate.day)

class Change(ndb.Model):
    className = ndb.StringProperty(indexed=False)
    date = ndb.StringProperty(indexed=True)
    changes = ndb.StringProperty(indexed=False)

    @classmethod
    def get_week(cls):
        today = date.today()
        day = timedelta(days=1)
        return cls.query(cls.date.IN([
            _format_date_ISO8601(today),
            _format_date_ISO8601(today + (day * 1)),
            _format_date_ISO8601(today + (day * 2)),
            _format_date_ISO8601(today + (day * 3)),
            _format_date_ISO8601(today + (day * 4)),
            _format_date_ISO8601(today + (day * 5)),
            _format_date_ISO8601(today + (day * 6))
        ])).fetch()

    @classmethod
    def get_all(cls):
        return cls.query().fetch()

    @classmethod
    def lookup(cls, urlsafe):
        return ndb.Key(urlsafe=urlsafe).get()

    @classmethod
    def create(cls, date, className, changes):
        return Change(date=date, className=className,
            changes=json.dumps(changes))

    @classmethod
    def delete(cls, urlsafe):
        ndb.Key(urlsafe=urlsafe).delete()


class User(ndb.Model):
    email = ndb.StringProperty(indexed=True)
    passwd = ndb.StringProperty(indexed=False)

    @classmethod
    def lookup(cls, email):
        return cls.query(cls.email == email).fetch(1)[0]
