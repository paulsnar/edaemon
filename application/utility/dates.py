# coding: utf-8

import re
from datetime import date, timedelta

class ISO8601(object):
    @staticmethod
    def parse(_date):
        return date(int(_date[0:4]), int(_date[5:7]), int(_date[8:10]))

    @staticmethod
    def is_valid(_date):
        if re.search(r'\d{4}-\d{2}-\d{2}', _date):
            return True
        else:
            return False
