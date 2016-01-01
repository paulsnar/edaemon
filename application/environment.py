# coding: utf-8

from jinja2 import Environment, PackageLoader
from google.appengine.api import users

from .utility.i18n import format_date
from .version import EDAEMON_VERSION

env = Environment(loader=PackageLoader(__name__, 'templates'))

# TODO: move this
edaemon = dict(
    version=EDAEMON_VERSION
)

env.globals = dict(
    edaemon=edaemon,
    users=users,
    format_date=format_date
)
