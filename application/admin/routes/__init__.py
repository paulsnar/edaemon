# coding: utf-8

from .index import AdminIndex
from .all_changes import AllChanges
from .new_change import NewChange

all_routes = [
    (r'/admin/', AdminIndex),
    (r'/admin/changes/all', AllChanges),
    (r'/admin/changes/new', NewChange)
]
