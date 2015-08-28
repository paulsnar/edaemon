import xml.etree.ElementTree as ET

class Feed(object):
    def __init__(self):
        self.root_elem = ET.Element('rss')
        self.root_elem.set('version', '2.0')
        self.channel_elem = ET.SubElement(self.root_elem, 'channel')

        # Mandatory elements
        self.title_elem = ET.SubElement(self.channel_elem, 'title')
        self.description_elem = ET.SubElement(self.channel_elem, 'description')
        self.link_elem = ET.SubElement(self.channel_elem, 'link')

        # Optional elements
        self.ttl_elem = ET.SubElement(self.channel_elem, 'ttl')
        self.ttl_elem.text = '30'
        # TODO: implement lastBuildDate

        self.title = ''
        self.description = ''
        self.link = ''
        self.children = []

        self.rendered = False

    def add_item(self, item):
        self.children.append(item)

    def render(self):
        if self.rendered: return # only once.
        self.rendered = True
        self.title_elem.text = self.title
        if self.description == '':
            self.description_elem.text = self.title
        else:
            self.description_elem.text = self.description
        self.link_elem.text = self.link

        for child in self.children:
            child.install(self.channel_elem)

        return ET.tostring(self.root_elem, encoding='utf-8')


class FeedItem(object):
    def __init__(self):
        self.id = ''
        self.link = ''
        self.title = ''

    def install(self, channel_elem):
        elem = ET.SubElement(channel_elem, 'item')
        id_elem = ET.SubElement(elem, 'guid')
        id_elem.set('isPermalink', 'true') # by default
        id_elem.text = self.id
        link_elem = ET.SubElement(elem, 'link')
        link_elem.text = self.link
        title_elem = ET.SubElement(elem, 'title')
        title_elem.text = self.title
