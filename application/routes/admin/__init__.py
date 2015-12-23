# coding: utf-8

from .management_init import ManagementInit
from .all_changes import AllChanges
from .create_change import CreateChange

from .api_routes import api_routes

all_routes = [
    ('/admin/', ManagementInit),
    ('/admin/changes', AllChanges),
    ('/admin/changes/new', CreateChange),
]

all_routes += api_routes
