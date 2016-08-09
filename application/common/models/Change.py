# coding: utf-8

from google.appengine.ext import ndb
import json
from datetime import date, timedelta


class Change(ndb.Model):
    for_class = ndb.StringProperty(indexed=True)
    for_date = ndb.DateProperty(indexed=True)
    lessons = ndb.JsonProperty(indexed=False)
    purgeable_since = ndb.DateProperty(indexed=True)

    @classmethod
    def get_first_for_class(cls, for_class):
        return cls.query(cls.for_class == for_class,
            cls.purgeable_since == None).get()

    @classmethod
    def get_week(cls):
        today = date.today()
        today_plus_week = today + timedelta(days=7)
        return cls.query(cls.for_date >= today, cls.for_date < today_plus_week,
            cls.purgeable_since == None)

    @classmethod
    def get_week_for_class(cls, for_class):
        today = date.today()
        today_plus_week = today + timedelta(days=7)
        return cls.query(
            cls.for_date >= today,
            cls.for_date < today_plus_week,
            cls.for_class == for_class,
            cls.purgeable_since == None
        )

    @classmethod
    def get_all(cls):
        return cls.query(cls.purgeable_since == None)

    @classmethod
    def get_deleted(cls):
        return cls.query(cls.purgeable_since != None)

    @classmethod
    def get_for_date(cls, for_date):
        return cls.query(cls.for_date == for_date,
            cls.purgeable_since == None).order(cls.for_class)

    @classmethod
    def get_for_class(cls, for_class):
        return cls.query(cls.for_class == for_class,
            cls.purgeable_since == None).order(cls.for_date)

    def to_dict(self):
        selfdict = dict(
            id=self.key.urlsafe()
        )

        try:
            selfdict['for_class'] = self.for_class
        except ndb.UnprojectedPropertyError:
            pass

        try:
            selfdict['for_date'] = self.for_date.isoformat()
        except ndb.UnprojectedPropertyError:
            pass

        try:
            selfdict['lessons'] = json.loads(self.lessons)
        except ndb.UnprojectedPropertyError:
            pass # in case of a partial query

        try:
            if self.purgeable_since is not None:
                selfdict['deleted'] = True
        except ndb.UnprojectedPropertyError:
            pass

        return selfdict
