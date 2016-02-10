# Edaemon β

[![Build Status](https://travis-ci.org/paulsnar/edaemon.svg)](https://travis-ci.org/paulsnar/edaemon)

Nothing to see here, move along now. :smile:

## Setup

(assuming Unix/Linux/GNU or whatever, not Windows)

* make sure you have Python Google App Engine SDK for Python, Node (v5.0 and up recommended), npm and gulp.
* clone this repository (preferably a tagged commit)
* copy `app.yaml.example` to `app.yaml` and fill out the fields GAE requires
* `bower install`
* `cd management_frontend && npm install && gulp js.dist`
* `appcfg.py update ./`
* pretty much done

Any questions → [@paulsnar](https://twitter.com/paulsnar) on twitter

# Contribution guidelines

Frontend:
* Please write tests, put them along your contributions in `__tests__` directory and name them like `Component.test.js`. Make sure do not forget this.
* Do not forget `'use strict'`.
* You can use arrow functions and template strings. Please don't use arrow functions in tests though, that breaks stuff with Webpack sometimes. Babel transforms only JSX, not ES6→5.
* Adhere to JSHint. Please check whether `gulp js.hint` throws any errors at you. If so, please fix them. W097 should be disabled on each file, W119 on arrow functions and template strings BUT back on afterwards. Other warnings should not be disabled and must be fixed.
* CI will run tests and JSHint for you. PRs which don't pass CI will not be merged. Please do what you must to not get caught in CI.
* Four spaces, 80-char width. Except in JSX, where it can exceed 80 chars. But always four spaces. LF (Unix-style) line endings. (.editorconfig coming soon.)
* Try to adhere to the overall code style of other files. When in doubt, try to stick to something similar to AirBNB's style guidelines, they are quite close. (But remember, four spaces.)
* I reserve the right to point at your mistakes, and possibly help you fix them. This is not a comprehensive styleguide, so I may ask you to adjust accordingly. Thank you in advance for understanding.

Backend:
* Tests are encouraged, but not required. (Currently there are none, so take that as you wish.)
* Because GAE uses Python 2, I heavily recommend adding `# coding: utf-8` to escape some problems. If you don't do this, it most likely won't make me reject your contributions, but I recommend it strongly.
* Unless it's a route file, avoid defining too many classes in one file. There should be a certain amount of modularity involved.
* For Python: four spaces, 80-char width, LF (Unix-style) line endings. For HTML+Jinja2: four spaces, unlimited width. Preferrably LF line endings.

# License

Edaemon is distributed under Apache License 2.0. To learn more, refer to
[LICENSE.txt](LICENSE.txt).
