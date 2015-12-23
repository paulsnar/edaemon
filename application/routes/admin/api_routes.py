# coding: utf-8

api_routes = [ ]

from .api.changes import changes_routes
api_routes += changes_routes
