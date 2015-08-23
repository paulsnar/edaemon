# coding: utf-8
import unittest
from google.appengine.ext import ndb, testbed
from werkzeug.security import generate_password_hash
from flask import session, request

from edaemon.ndbmodels import User
import app as Edaemon

class AdminAuthTestcase(unittest.TestCase):
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        ndb.get_context().clear_cache()

        self.app = Edaemon.app.test_client()

        self.user = User(
            email='test@example.com', passwd=generate_password_hash('passwd'))
        self.user.put()

    def tearDown(self):
        self.testbed.deactivate()

    def test_admin_login(self):
        """Test admin login with proper XSRF protections in place."""
        token = None
        with self.app as app:
            rv = app.get('/a/login')
            assert not session['xsrf'] is None
            token = session['xsrf']
        rv = self.app.post('/a/login', follow_redirects=True, data=dict(
            email='test@example.com', passwd='passwd', _xsrf=token))
        assert 'test@example.com' in rv.data

    def test_admin_logout(self):
        """Test whether logout works as intended."""
        self.test_admin_login()
        rv = self.app.get('/a/logout', follow_redirects=True)
        assert not 'test@example.com' in rv.data

    def test_admin_not_allow_double_login(self):
        """Test whether the application doesn't allow to log in if you already have."""
        self.test_admin_login()
        rv = self.app.get('/a/login', follow_redirects=True)
        assert 'test@example.com' in rv.data

    def test_admin_xsrf_missing_both(self):
        """Test failure with no XSRF defined in both form and session."""
        # we need a fresh client for guarantee of no XSRF in session
        with Edaemon.app.test_client() as c:
            with c.session_transaction() as session:
                assert session.get('xsrf', None) is None
            rv = c.post('/a/login', follow_redirects=True, data=dict(
                email='test@example.com', passwd='passwd'))
            assert not 'test@example.com' in rv.data

    def test_admin_xsrf_missing_form(self):
        """Test failure with no XSRF in form."""
        with self.app as c:
            c.get('/a/login')
            assert not session.get('xsrf', None) is None
            rv = c.post('/a/login', follow_redirects=True, data=dict(
                email='test@example.com', passwd='passwd'))
            assert not 'test@example.com' in rv.data

    def test_admin_xsrf_form_empty(self):
        """Test failure with XSRF being '' in form."""
        with self.app as c:
            c.get('/a/login')
            assert not session.get('xsrf', None) is None
            rv = c.post('/a/login', follow_redirects=True, data=dict(
                email='test@example.com', passwd='passwd', _xsrf=''))
            assert not 'test@example.com' in rv.data

    def test_admin_xsrf_form_random(self):
        """Test failure with XSRF not matching the one stored in session."""
        with self.app as c:
            c.get('/a/login')
            assert not session.get('xsrf', None) is None
            assert session['xsrf'] != 'nul'
            rv = c.post('/a/login', follow_redirects=True, data=dict(
                email='test@example.com', passwd='passwd', _xsrf='nul'))
            assert not 'test@example.com' in rv.data
