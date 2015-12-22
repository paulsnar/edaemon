from google.appengine.ext import ndb
import json

from ..utility import create_week_formatted

class Change(ndb.Model):
    className = ndb.StringProperty(indexed=True)
    date = ndb.StringProperty(indexed=True)
    changes = ndb.StringProperty(indexed=False)

    @classmethod
    def get_first_for_class(cls, className):
        return cls.query(cls.className == className).fetch(1)[0]

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
    def get_all_for_date(cls, date):
        return cls.query(cls.date == date).fetch()

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
