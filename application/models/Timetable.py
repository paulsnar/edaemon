from google.appengine.ext import ndb
import json

class Timetable(ndb.Model):
    for_class = ndb.StringProperty(indexed=True)
    plan = ndb.StringProperty(indexed=False)

    @classmethod
    def get_for_class(cls, for_class):
        return cls.query(cls.for_class == for_class)

    @classmethod
    def get_all(cls):
        return cls.query()

    def to_dict(self):
        selfdict = dict(
            id=self.key.urlsafe(),
            for_class=self.for_class
        )
        try:
            selfdict['plan'] = json.loads(self.plan)
        except ndb.UnprojectedPropertyError:
            pass
        return selfdict
