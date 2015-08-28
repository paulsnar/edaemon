VERSION = '1.0.4'

from flask import Flask, render_template
import os

from edaemon.main import bp as MainBlueprint
from edaemon.admin import bp as AdminBlueprint
from edaemon.rss import bp as RSSBlueprint

app = Flask(__name__)
_environ_GA_TRACKING_ID = os.environ.get('GA_TRACKING_ID', None)
if not _environ_GA_TRACKING_ID is None:
    app.config['_environ_GA_TRACKING_ID'] = _environ_GA_TRACKING_ID
app.secret_key = os.environ['EDAEMON_APP_SECRET_KEY']

app.config['VERSION'] = VERSION
app.config['silent'] = int(os.environ['EDAEMON_APP_SILENT']) == 1

app.register_blueprint(MainBlueprint)
app.register_blueprint(AdminBlueprint, url_prefix='/a')
app.register_blueprint(RSSBlueprint, url_prefix='/feeds')

@app.errorhandler(404)
def four_oh_four(e):
    return render_template('404.htm'), 404
