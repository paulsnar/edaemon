# coding: utf-8
import unittest
from google.appengine.ext import ndb, testbed
from werkzeug.security import generate_password_hash
from flask import session, request
from datetime import date, timedelta
import json

from edaemon.ndbmodels import Change, _format_date_ISO8601
import app as Edaemon

class MainPageTestcase(unittest.TestCase):
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        ndb.get_context().clear_cache()

        self.app = Edaemon.app.test_client()

    def tearDown(self):
        self.testbed.deactivate()

    def test_frontpage_with_no_changes(self):
        """Test whether displaying frontpage without any changes displays no changes."""
        rv = self.app.get('/')
        assert 'Neatradu!' in rv.data

    def test_frontpage_with_changes(self):
        """Test whether frontpage displays changes for near future."""
        today = _format_date_ISO8601(date.today())
        change = Change(date=today, className='14.a', changes='[]').put()
        rv = self.app.get('/')
        assert '14.a' in rv.data and today in rv.data
        change.delete()

    def test_frontpage_with_far_future_changes(self):
        """Test whether changes beyond 1 week are hidden on frontpage."""
        day = _format_date_ISO8601(date.today() + timedelta(days=8))
        change = Change(date=day, className='12.r', changes='[]').put()
        rv = self.app.get('/')
        assert 'Neatradu!' in rv.data
        assert not '12.r' in rv.data and not day in rv.data
        change.delete()

    def test_changes_invalid_id(self):
        """Test whether handling invalid ID on changes page fails with 404 (gracefully)."""
        rv = self.app.get('/show/nul')
        assert rv.status_code == 404

    def test_changes_show(self):
        """Test whether showing a single change entry works."""
        change = Change.create(date='2000-01-01', className='13.t', changes=[
            'Test Change 0', 'Test Change 1', None, None, 'Test Change 4', None,
            'Test Change 6', 'Test Change 7', None]).put()
        rv = self.app.get('/show/{0}'.format(change.urlsafe()))
        assert rv.status_code == 200
        assert '2000-01-01' in rv.data
        assert '13.t' in rv.data
        assert 'Test Change 0' in rv.data
        assert 'Test Change 1' in rv.data
        assert 'Test Change 4' in rv.data
        assert 'Test Change 6' in rv.data
        assert 'Test Change 7' in rv.data
        # not testing overflows because that isn't guarded in model level
        change.delete()
