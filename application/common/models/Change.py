from google.appengine.ext import ndb
import json

from application.utility import format_week

class Change(ndb.Model):
    for_class = ndb.StringProperty(indexed=True)
    for_date = ndb.StringProperty(indexed=True)
    lessons = ndb.StringProperty(indexed=False)

    @classmethod
    def get_first_for_class(cls, for_class):
        return cls.query(cls.for_class == for_class).get()

    @classmethod
    def get_week(cls):
        return cls.query(cls.for_date.IN(format_week()))

    @classmethod
    def get_week_for_class(cls, for_class):
        return cls.query(ndb.AND(
            cls.for_class == for_class,
            cls.for_date.IN(format_week())
        ))

    @classmethod
    def get_all(cls):
        return cls.query()

    @classmethod
    def get_for_date(cls, for_date):
        return cls.query(cls.for_date == for_date).order(cls.for_class)

    @classmethod
    def get_for_class(cls, for_class):
        return cls.query(cls.for_class == for_class).order(cls.for_date)

    @classmethod
    def lookup_url(cls, urlsafe):
        return ndb.Key(urlsafe=urlsafe).get()

    @classmethod
    def delete_url(cls, urlsafe):
        ndb.Key(urlsafe=urlsafe).delete()

    def to_dict(self):
        selfdict = dict()
        selfdict['id'] = self.key.urlsafe()
        selfdict['for_class'] = self.for_class
        selfdict['for_date'] = self.for_date
        try:
            selfdict['lessons'] = json.loads(self.lessons)
        except ndb.UnprojectedPropertyError:
            pass # in case of a partial query
        return selfdict
