from flask import Flask, render_template
import os

from edaemon.main import bp as MainBlueprint
from edaemon.admin import bp as AdminBlueprint

app = Flask(__name__)
_environ_GA_TRACKING_ID = os.environ.get('GA_TRACKING_ID', None)
if not _environ_GA_TRACKING_ID is None:
    app.config['_environ_GA_TRACKING_ID'] = _environ_GA_TRACKING_ID
app.config['VERSION'] = '1.0.0'
app.secret_key = os.environ['EDAEMON_APP_SECRET_KEY']
# app.config['DEBUG'] = True

app.register_blueprint(MainBlueprint)
app.register_blueprint(AdminBlueprint, url_prefix='/a')

@app.errorhandler(404)
def four_oh_four(e):
    return render_template('404.j2'), 404
