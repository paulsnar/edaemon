# coding: utf-8

from jinja2 import Environment, PackageLoader
from application.common import common_globals

environment = Environment(loader=PackageLoader(__name__, '.'))
environment.globals = common_globals
