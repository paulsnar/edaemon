# coding: utf-8
import unittest
from google.appengine.ext import ndb, testbed
from werkzeug.security import generate_password_hash
from flask import session, request
from datetime import date
import json

from edaemon.ndbmodels import User, Change
from edaemon.utility import format_date_ISO8601
import app as Edaemon

class AdminChangesTestcase(unittest.TestCase):
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

    def login(self, c):
        rv = c.get('/a/login', follow_redirects=True)
        if not 'test@example.com' in rv.data:
            rv = c.post('/a/login', follow_redirects=True, data=dict(
                email='test@example.com', passwd='passwd', _xsrf=session['xsrf']))
            assert 'test@example.com' in rv.data

    def create_change(self, c, data=None):
        today = format_date_ISO8601(date.today())
        _data = dict()
        if data is None:
            _data = dict(className='0.a', date=today)
        else:
            _data = data
        rv = c.post('/a/changes/new', follow_redirects=True, data=_data)
        return (rv, request.view_args['change_id'])

    def test_admin_change_create(self):
        today = format_date_ISO8601(date.today())
        with self.app as c:
            self.login(c)
            rv, change_id = self.create_change(c, dict(
                className='99.z', date=today,
                subject_0='-', subject_1='Test Subject 1', subject_2='-',
                subject_3='Test Subject 3', subject_6='Test Subject 6',
                subject_9='Test Subject 9', subject_none='Test Subject None'))
            assert '99.z' in rv.data
            assert today in rv.data
            assert 'Test Subject 1' in rv.data
            assert 'Test Subject 3' in rv.data
            assert 'Test Subject 6' in rv.data
            assert not 'Test Subject 9' in rv.data
            assert not 'Test Subject None' in rv.data
            change = Change.lookup(request.view_args['change_id'])
            subjects = json.loads(change.changes)
            assert len(subjects) == 9
            change.key.delete()

    def test_admin_change_delete(self):
        with self.app as c:
            self.login(c)
            rv, change_id = self.create_change(c)
            rv = c.post('/a/changes/delete/{0}'.format(change_id),
                follow_redirects=True)
            assert 'Neatradu!' in rv.data

    def test_admin_changes_list(self):
        today = format_date_ISO8601(date.today())
        with self.app as c:
            self.login(c)
            change1 = Change(className='1.a', date='2000-01-01', changes='[]')\
                .put()
            change2 = Change(className='2.b', date=today, changes='[]').put()
            change3 = Change(className='3.c', date='2020-12-31', changes='[]')\
                .put()
            rv = c.get('/a/changes/')
            assert not 'Neatradu!' in rv.data
            assert '1.a' in rv.data and '2000-01-01' in rv.data
            assert '2.b' in rv.data and today in rv.data
            assert '3.c' in rv.data and '2020-12-31' in rv.data
            change1.delete()
            change2.delete()
            change3.delete()

    def test_admin_changes_list_empty(self):
        with self.app as c:
            self.login(c)
            rv = c.get('/a/changes/')
            assert 'Neatradu!' in rv.data

    def test_admin_changes_edit(self):
        today = format_date_ISO8601(date.today())
        with self.app as c:
            self.login(c)
            rv, change_id = self.create_change(c, dict(
                className='99.z', date=today,
                subject_0='-', subject_1='Test Subject 1', subject_2='-',
                subject_3='Test Subject 3'))
            rv = c.post('/a/changes/edit/{0}'.format(change_id),
                follow_redirects=True, data=dict(
                    className='98.z', date=today,
                    subject_0='Test Subject 0', subject_1='-', subject_2='-',
                    subject_3='Test Subject 3'))
            assert not 'Test Subject 1' in rv.data
            assert not '99.z' in rv.data
            assert today in rv.data
            assert '98.z' in rv.data
            assert 'Test Subject 0' in rv.data
            assert 'Test Subject 3' in rv.data
            change = Change.lookup(change_id)
            change.key.delete()
