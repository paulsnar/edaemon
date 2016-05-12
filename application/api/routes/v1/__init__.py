# coding: utf-8

from .changes import AllChanges, SpecificChange, ChangesForClass, ChangesForDate

v1_routes = [
    (r'/api/v1/changes', AllChanges),
    (r'/api/v1/changes/([0-9A-Za-z\-_]+)', SpecificChange),
    (r'/api/v1/changes/for_date/([0-9]{4}-[0-9]{2}-[0-9]{2})', ChangesForDate),
    (r'/api/v1/changes/for_class/([0-9A-Za-z\.]+)', ChangesForClass)
]
