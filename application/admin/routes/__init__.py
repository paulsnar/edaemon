# coding: utf-8

from .index import AdminIndex
from .all_changes import AllChanges

all_routes = [
    (r'/admin/', AdminIndex),
    (r'/admin/changes/all', AllChanges)
]
