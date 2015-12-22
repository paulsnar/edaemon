from google.appengine.ext import ndb

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
