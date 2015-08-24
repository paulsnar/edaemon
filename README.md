# Edaemon

Šis LASIMANI ir pieejams arī [latviešu valodā](README.md).

Edaemon is a quite simple application for managing changes of school timetables.

## Setup

Edaemon is created specifically to be compatible with Google App Engine. If you
don't expect it to be hit too often, it might just fit in the free plan quotas.

To set it up:

1. Install [Google App Engine SDK for Python](https://cloud.google.com/appengine/downloads)
  (and Python 2.7, if you don't already have it).
2. Create a new app in [Google Developers Console](https://console.developers.google.com).
  The name doesn't really matter. Also HTTPS is enabled by default with a cert from Google's CA.
3. Clone this repository (or rather, the latest tag, which is production-ready).
4. cd into this repository and run `pip install -r requirements.txt -t lib/` locally
  to install all the necessary requirements (mainly Flask and Jinja2).
5. Copy `app.yaml.example` to `app.yaml` and change the following fields:
  - `env_variables.EDAEMON_APP_SECRET_KEY`: This should be replaced with a string
  about 32 characters long. Flask uses this to encrypt/decrypt session cookies.
  - `env_variables.GA_TRACKING_ID`: If you want to use Google Analytics tracking
  for your app, replace this with your Google Tracking ID (something like `UA-12345678-1`).
  It will be injected on each served page (see
  [vendor/edaemon/templates/layout.j2](vendor/edaemon/template/layout.j2))
6. Execute `appcfg.py -A your-app-id-12345 update ./` from the repo directory.
  `appcfg.py` is provided by the Google SDK. If this doesn't work, refer to the
  [Google App Engine SDK for Python documentation](https://cloud.google.com/appengine/docs/python/).

Note: for Windows many of these steps might differ in slight or big ways, as well
as the testing steps lower down. I'm not quite sure about anything, but if you
manage to get any of this working, pull requests are indeed accepted.

As of now there is no interface for the initial setup (the creation of first
user). That can be done manually, by going to the [console](https://console.developers.google.com),
and creating a new Datastore entry of kind `User` with two fields:
- `email` (a string, indexed): the email to log in with
- `passwd` (a string, not indexed): a hash of the password used to log in,
created by running `werkzeug.security.generate_password_hash(password)`.

## Testing

Edaemon has a test suite which can be fond in `tests/`. If you are adding any new
functionality, please make sure to add relevant tests in that folder and importing
any created test files in `tests/__init__.py`, or else your code might not be
pulled into this repo.

To run the existing tests:

1. Make sure to have Python,
  [Google App Engine SDK for Python](https://cloud.google.com/appengine/downloads)
  and all the necessary dependencies installed in `lib/`.
2. Set your PYTHONPATH to include the SDK, root folder of this repo, as well as
  `lib/` and `vendor/`.
  (Google's SDK is also not of best consistency, so PYTHONPATH might also need to
  include some of its subfolders. If you get any error running tests, Google it.
  You almost definitely will find a solution.)
3. Run `python -m unittest tests` (or alternatively, if `python` doesn't refer
  to Python 2.7, use `python2` or `python2.7`, if available.)

## License

Edaemon is distributed under Apache License 2.0. To learn more, refer to
[LICENSE.txt](LICENSE.txt).
