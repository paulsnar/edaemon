# coding: utf-8

from .index import AdminIndex
from .all_changes import AllChanges
from .new_change import NewChange
from .show_change import ShowChange

all_routes = [
    (r'/admin/', AdminIndex),
    (r'/admin/changes/all', AllChanges),
    (r'/admin/changes/new', NewChange),
    (r'/admin/changes/([0-9A-Za-z\-_]+)', ShowChange)
]
