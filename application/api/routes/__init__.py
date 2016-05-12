# coding: utf-8

from .misc import ApiWelcome

all_routes = [
    (r'/api/', ApiWelcome)    
]

from .v1 import v1_routes

all_routes += v1_routes
