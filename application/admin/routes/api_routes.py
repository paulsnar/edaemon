# coding: utf-8

api_routes = [ ]

from .api.changes import changes_routes
api_routes += changes_routes

from .api.timetables import timetables_routes
api_routes += timetables_routes

from .api.cron import cron_routes
api_routes += cron_routes

