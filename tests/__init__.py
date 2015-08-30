import os as _os
_os.environ['EDAEMON_APP_SECRET_KEY'] = 'E92(hl?4ewF)nN{!'
_os.environ['EDAEMON_APP_SILENT'] = '1'

# set up proper exception throwing
import app as Edaemon
Edaemon.app.debug = True

from unittest import TestSuite

import test_admin_auth
import test_admin_changes
import test_admin_user
import test_main
import test_rss

test_cases = (test_admin_auth.AdminAuthTestcase,
    test_admin_changes.AdminChangesTestcase,
    test_admin_user.AdminUserManagementTestcase,
    test_main.MainPageTestcase,
    test_rss.RSSTestcase)

def load_tests(loader, standard_tests, pattern):
    suite = TestSuite()
    for test_class in test_cases:
        tests = loader.loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    return suite
