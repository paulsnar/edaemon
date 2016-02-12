# coding: utf-8

from .all_changes import AllChanges
from .show_change import ShowChange
from .changes_for_date import ChangesForDate
from .changes_for_class import ChangesForClass

all_routes = [
    (r'/', AllChanges),
    (r'/changes/show/([0-9A-Za-z\-_]+)', ShowChange),
    (r'/changes/by_date/([0-9]{4}-[0-9]{2}-[0-9]{2})', ChangesForDate),
    (r'/changes/for_class/([0-9A-Za-z\.]+)', ChangesForClass),
]
