import os as _os
_os.environ['EDAEMON_APP_SECRET_KEY'] = 'E92(hl?4ewF)nN{!'

from unittest import TestSuite

import test_admin_auth
import test_admin_changes
import test_main

test_cases = (test_admin_auth.AdminAuthTestcase,
    test_admin_changes.AdminChangesTestcase,
    test_main.MainPageTestcase)

def load_tests(loader, standard_tests, pattern):
    suite = TestSuite()
    for test_class in test_cases:
        tests = loader.loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    return suite
