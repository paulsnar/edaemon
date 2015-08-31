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
        return cls.query(cls.date.IN(create_week_formatted())).fetch()

    @classmethod
    def get_week_for_class(cls, className):
        return cls.query(ndb.AND(
            cls.className == className,
            cls.date.IN(create_week_formatted())
        )).fetch()

    @classmethod
    def get_all(cls):
        return cls.query().fetch()

    @classmethod
    def get_all_for_class(cls, className):
        return cls.query(cls.className == className).fetch()

    @classmethod
    def get_today_for_class(cls, className):
        today = format_date_ISO8601(date.today())
        return cls.query(ndb.AND(
            cls.className == className,
            cls.date == today)).get()

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

    @classmethod
    def has_class_today(cls, className):
        today = format_date_ISO8601(date.today())
        return cls.query(ndb.AND(
            cls.className == className,
            cls.date == today)).count() > 0


class Timetable(ndb.Model):
    className = ndb.StringProperty(indexed=True)
    timetable = ndb.StringProperty(indexed=False)

    @classmethod
    def get_all(cls):
        return cls.query().fetch()

    @classmethod
    def class_exists(cls, className):
        return cls.query(cls.className == className).count() > 0

class User(ndb.Model):
    email = ndb.StringProperty(indexed=True)
    passwd = ndb.StringProperty(indexed=False)

    @classmethod
    def lookup(cls, email):
        return cls.query(cls.email == email).get()

    @classmethod
    def email_exists(cls, email):
        return cls.query(cls.email == email).count() > 0

    @classmethod
    def count(cls):
        return cls.query().count()
