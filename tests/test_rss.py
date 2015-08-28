# coding: utf-8
import unittest
from google.appengine.ext import ndb, testbed
from datetime import date, timedelta
import xml.etree.ElementTree as ET

from edaemon.ndbmodels import Change
from edaemon.utility import format_date_ISO8601
import app as Edaemon

today = format_date_ISO8601(date.today())

class RSSTestcase(unittest.TestCase):
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        ndb.get_context().clear_cache()

        self.app = Edaemon.app.test_client()

    def tearDown(self):
        self.testbed.deactivate()

    def test_rss_general_structure(self):
        """Test whether the RSS feed conforms to RSS XML standard."""
        change = Change(date=today, className='1.n', changes='[]').put()
        rv = self.app.get('/feed/week.xml')
        xml = ET.fromstring(rv.data)
        assert xml.tag == 'rss'
        assert xml.attrib['version'] == '2.0'

        channels = xml.findall('channel')
        assert len(channels) == 1 # only one channel
        channel = channels[0]

        # has mandatory elements
        assert not channel.find('title') is None
        assert not channel.find('link') is None
        assert not channel.find('description') is None

        # has ttl elem (not mandatory, but used here)
        assert not channel.find('ttl') is None

        # displays change as item
        items = channel.findall('item')
        assert len(items) == 1

        # change has the information in title
        item = items[0]
        assert '1.n' in item.find('title').text
        assert today in item.find('title').text

        change.delete()

        # because the class-only generation is quite similar to regular,
        # we don't test it separately.

    def test_rss_without_changes(self):
        """Test whether the RSS feed shows no changes if there are none present."""
        rv = self.app.get('/feed/week.xml')
        xml = ET.fromstring(rv.data)
        assert len(xml.find('channel').findall('item')) == 0

    def test_rss_with_changes(self):
        """Test whether the RSS feed shows changes in the range of a week."""
        change1 = Change(date=today, className='1.n', changes='[]').put()
        change2 = Change(date=today, className='2.n', changes='[]').put()
        rv = self.app.get('/feed/week.xml')
        xml = ET.fromstring(rv.data)
        channel = xml.find('channel')

        items = channel.findall('item')
        assert len(items) == 2

        item1 = items[0]
        item2 = items[1]
        # order is not guaranteed, so the assertions are bit weird
        assert '1.n' in item1.find('title').text or \
               '2.n' in item1.find('title').text
        assert '2.n' in item2.find('title').text or \
               '1.n' in item2.find('title').text

        assert today in item1.find('title').text
        assert today in item2.find('title').text

        change1.delete()
        change2.delete()

    def test_rss_with_far_future_changes(self):
        """Test whether the RSS feed hides changes further than a week."""
        day = format_date_ISO8601(date.today() + timedelta(days=8))
        change1 = Change(date=today, className='1.n', changes='[]').put()
        change2 = Change(date=day, className='2.n', changes='[]').put()
        rv = self.app.get('/feed/week.xml')
        xml = ET.fromstring(rv.data)
        channel = xml.find('channel')

        items = channel.findall('item')
        assert len(items) == 1


        item = items[0]
        assert '1.n' in item.find('title').text
        assert today in item.find('title').text

        assert not '2.n' in rv.data
        assert not day in rv.data

        change1.delete()
        change2.delete()

    def test_class_rss_without_changes(self):
        """Test whether the class RSS feed works without changes."""
        rv = self.app.get('/feed/class/1.n/week.xml')
        xml = ET.fromstring(rv.data)
        assert len(xml.find('channel').findall('item')) == 0

    def test_class_rss_with_changes(self):
        """Test whether the class RSS feed displays changes, only for the specified class."""
        change1 = Change(date=today, className='1.n', changes='[]').put()
        change2 = Change(date=today, className='2.n', changes='[]').put()
        rv = self.app.get('/feed/class/1.n/week.xml')
        xml = ET.fromstring(rv.data)
        channel = xml.find('channel')

        items = channel.findall('item')
        assert len(items) == 1

        item = items[0]
        assert today in item.find('title').text

        assert not '2.n' in rv.data

        change1.delete()
        change2.delete()

    def test_class_rss_with_far_future_changes(self):
        """Test whether the class RSS feed hides changes further than a week."""
        day = format_date_ISO8601(date.today() + timedelta(days=8))
        change1 = Change(date=today, className='1.n', changes='[]').put()
        change2 = Change(date=day, className='1.n', changes='[]').put()
        rv = self.app.get('/feed/class/1.n/week.xml')
        xml = ET.fromstring(rv.data)
        channel = xml.find('channel')

        items = channel.findall('item')
        assert len(items) == 1

        item = items[0]
        assert today in item.find('title').text

        assert not day in rv.data

        change1.delete()
        change2.delete()
