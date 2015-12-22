from google.appengine.ext import ndb

class Class(ndb.Model):
    className = ndb.StringProperty(indexed=True)

    @classmethod
    def get_all(cls):
        return [x.className for x in cls.query().fetch()]

    @classmethod
    def lookup(cls, name):
        return cls.query(cls.className == name).get()

    @classmethod
    def ensure_exists(cls, name):
        if not cls.exists(name):
            return cls(className=name).put()

    @classmethod
    def exists(cls, name):
        return cls.query(cls.className == name).count() > 0
