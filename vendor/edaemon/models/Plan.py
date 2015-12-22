from google.appengine.ext import ndb
import json

from .Class import Class

class Plan(ndb.Model):
    parentClass = ndb.KeyProperty(indexed=True, kind=Class)
    lessonPlan = ndb.StringProperty(indexed=False)
