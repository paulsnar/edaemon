# coding: utf-8
import unittest
from google.appengine.ext import ndb, testbed
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session, request
import re

from edaemon.ndbmodels import User
import app as Edaemon

class AdminUserManagementTestcase(unittest.TestCase):
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
                email='test@example.com', passwd='passwd',
                    _xsrf=session['xsrf']))
            assert 'test@example.com' in rv.data

    def test_admin_create_user(self):
        """Test whether creating a user works."""
        with self.app as c:
            self.login(c)
            rv = c.post('/a/users/add', follow_redirects=True, data=dict(
                email='anotheruser@example.com',
                password1='testpw',
                password2='testpw'
            ))
            assert rv.status_code == 200
            assert User.email_exists('anotheruser@example.com')
            newuser = User.lookup('anotheruser@example.com')
            assert check_password_hash(newuser.passwd, 'testpw')
            newuser.key.delete()

    def test_admin_create_user_disallow_duplicates(self):
        """Test whether the interface doesn't allow creating duplicate users."""
        with self.app as c:
            self.login(c)
            user = User(email='duplicate@example.com', passwd='').put()
            rv = c.post('/a/users/add', follow_redirects=True, data=dict(
                email='duplicate@example.com',
                password1='',
                password2=''
            ))
            assert rv.status_code == 200
            assert \
                User.query(User.email == 'duplicate@example.com').count() == 1
            user.delete()

    def test_admin_create_user_differing_passwords(self):
        """Test whether the interface doesn't create the user if password fields differ."""
        with self.app as c:
            self.login(c)
            rv = c.post('/a/users/add', follow_redirects=True, data=dict(
                email='differentpw@example.com',
                password1='password1',
                password2='password2'
            ))
            assert rv.status_code == 200
            assert not User.email_exists('differentpw@example.com')

    def test_admin_change_password(self):
        """Test whether an user can change their password."""
        with self.app as c:
            self.login(c)
            rv = c.post('/a/password', follow_redirects=True, data={
                'passwd1': 'newpw',
                'passwd2': 'newpw'
            })
            user = User.lookup(self.user.email)
            assert check_password_hash(user.passwd, 'newpw')
            # reset password for future tests
            user.passwd = generate_password_hash('passwd')
            user.put()

    def test_admin_change_password_differing_passwords(self):
        """Test whether the interface doesn't change your password if the fields differ."""
        with self.app as c:
            self.login(c)
            rv = c.post('/a/password', follow_redirects=True, data={
                'passwd1': 'passwd1',
                'passwd2': 'passwd2'
            })
            user = User.lookup(self.user.email)
            assert user.passwd == self.user.passwd

    def test_admin_initial_setup_shown(self):
        """Test whether the initial setup is shown when there are no users in datastore."""
        with self.app as c:
            with c.session_transaction() as session:
                session.pop('email', None)
            users = User.query().fetch()
            for user in users: user.key.delete()
            rv = c.get('/a/login', follow_redirects=True)
            matchr = r'https?://[a-zA-Z0-9-.]+(/.+)?.*'
            match = re.search(matchr, request.url).regs[1]
            path = request.url[match[0]:match[1]]
            assert path == '/a/setup'
            self.user.put() # recreate

    def test_admin_initial_setup(self):
        """Test whether the initial setup works."""
        with self.app as c:
            with c.session_transaction() as session:
                session.pop('email', None)
            users = User.query().fetch()
            for user in users: user.key.delete()
            rv = c.post('/a/setup', follow_redirects=True, data={
                'email': 'test@example.com',
                'passwd1': 'passwd',
                'passwd2': 'passwd'
            })
            assert User.count() == 1
            user = User.lookup('test@example.com')
            assert check_password_hash(user.passwd, 'passwd')
            self.user = user

    def test_admin_initial_setup_password_mismatch(self):
        """Test whether the initial setup fails if the passwords don't match."""
        with self.app as c:
            with c.session_transaction() as session:
                session.pop('email', None)
            users = User.query().fetch()
            for user in users: user.key.delete()
            rv = c.post('/a/setup', follow_redirects=True, data={
                'email': 'test@example.com',
                'passwd1': 'passwd1',
                'passwd2': 'passwd2'
            })
            assert User.count() == 0
            self.user.put()
