# coding: utf-8

from .admin import wsgi_app as admin_wsgi_endpoint
from .api import wsgi_app as api_wsgi_endpoint
from .main import wsgi_app as main_wsgi_endpoint
from .cron import wsgi_app as cron_wsgi_endpoint
