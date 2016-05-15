# coding: utf-8

import uuid

def unique(collection, prop, attr=False):
    uniques = set()
    for item in collection:
        if attr:
            uniques.add(getattr(item, prop))
        else:
            uniques.add(item[prop])
    return uniques

def generate_xsrf():
    return uuid.uuid4().hex

