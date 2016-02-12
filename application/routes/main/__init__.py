# coding: utf-8

from .all_changes import AllChanges
from .show_change import ShowChange
from .changes_for_date import ChangesForDate
from .changes_for_class import ChangesForClass

all_routes = [
    ('/', AllChanges),
    ('/changes/show/([0-9A-Za-z\-_]+)', ShowChange),
    ('/changes/by_date/([0-9-]{10})', ChangesForDate),
    ('/changes/for_class/([0-9A-Za-z\.]+)', ChangesForClass),
]
