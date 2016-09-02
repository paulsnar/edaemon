# coding: utf-8

import xml.etree.ElementTree as ET

class Feed(object):
    def __init__(self):
        self.root_el = ET.Element('rss')
        self.root_el.set('version', '2.0')

        channel = self.channel_el = ET.SubElement(self.root_el, 'channel')

        # Mandatory elements
        self.title_el = ET.SubElement(channel, 'title')
        self.description_el = ET.SubElement(channel, 'description')
        self.link_el = ET.SubElement(channel, 'link')

        # Optional elements
        ttl = self.ttl_el = ET.SubElement(channel, 'ttl')
        ttl.text = '30'

        self.title = ''
        self.description = ''
        self.link = ''
        # self.children = [ ]

    def add_item(self, id, link, title, id_is_permalink=True):
        item_el = ET.SubElement(self.channel_el, 'item')

        id_el = ET.SubElement(item_el, 'guid')
        if id_is_permalink:
            id_el.set('isPermaLink', 'true')
        id_el.text = id

        link_el = ET.SubElement(item_el, 'link')
        link_el.text = link

        title_el = ET.SubElement(item_el, 'title')
        title_el.text = title

        # return item_el

    def render(self):
        self.title_el.text = self.title
        self.description_el.text = self.description
        self.link_el.text = self.link

        # for child in self.children:
        #     if not child._installed:
        #         child._install(self.channel_el)

        return ET.tostring(self.root_el, encoding='utf-8')
