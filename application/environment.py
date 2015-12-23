# coding: utf-8
import os
from jinja2 import Environment, PackageLoader
from google.appengine.api import users
from .utility.i18n import format_date

env = Environment(loader=PackageLoader(__name__, 'templates'))

# TODO: move this
edaemon = dict(
    version = os.environ.get('EDAEMON_VERSION', '<script>alert(\'version\')</script><span style="color:red">UNKNOWN</span>'))

env.globals = dict(
    edaemon=edaemon,
    users=users,
    format_date=format_date
    )
