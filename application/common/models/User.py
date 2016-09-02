# coding: utf-8

from google.appengine.ext import ndb

from uuid import uuid4 as uuid

class User(ndb.Model):
    email = ndb.StringProperty(indexed=True)
    rss_token = ndb.StringProperty(indexed=True)
    rss_token_disabled = ndb.BooleanProperty(indexed=False)
    rss_token_ban_expires_at = ndb.DateProperty(indexed=False)

    @staticmethod
    def generate_rss_token():
        return str(uuid())

    @classmethod
    def find_by_email(cls, email):
        return cls.query(cls.email == email).get()

    @classmethod
    def find_by_rss_token(cls, rss_token):
        return cls.query(cls.rss_token == rss_token).get()
