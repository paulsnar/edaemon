# coding: utf-8

from .management_init import ManagementBootstrap

from .api_routes import api_routes

all_routes = [
    ('/admin/', ManagementBootstrap),
]

all_routes += api_routes
