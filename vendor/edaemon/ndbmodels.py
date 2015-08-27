from datetime import date, timedelta
from google.appengine.ext import ndb
import json

from .utility import format_date_ISO8601, create_week_formatted

class Change(ndb.Model):
    className = ndb.StringProperty(indexed=True)
    date = ndb.StringProperty(indexed=True)
    changes = ndb.StringProperty(indexed=False)

    @classmethod
    def get_week(cls):
        days = create_week_formatted()
        return cls.query(cls.date.IN(days)).fetch()

    @classmethod
    def get_all(cls):
        return cls.query().fetch()

    @classmethod
    def get_all_for_class(cls, className):
        return cls.query(cls.className == className).fetch()

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
