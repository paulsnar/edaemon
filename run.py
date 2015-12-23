import os
os.environ['EDAEMON_VERSION'] = '2.0.0-devel-20151222-1300'

import application

# import edaemon.blueprints as blueprints
# from edaemon.utility.view import install_view_utilities
# from edaemon.admin import bp as AdminBlueprint
# from edaemon.rss import bp as RSSBlueprint

# app = Flask(__name__)
# _environ_GA_TRACKING_ID = os.environ.get('GA_TRACKING_ID', None)
# if not _environ_GA_TRACKING_ID is None:
#     app.config['_environ_GA_TRACKING_ID'] = _environ_GA_TRACKING_ID
# app.secret_key = os.environ['EDAEMON_APP_SECRET_KEY']

# install_view_utilities(app.jinja_env)

# app.config['VERSION'] = VERSION
# app.config['silent'] = int(os.environ['EDAEMON_APP_SILENT']) == 1

# app.register_blueprint(blueprints.main)
# app.register_blueprint(blueprints.api, url_prefix='/api')
# app.register_blueprint(blueprints.admin, url_prefix='/a')
# app.register_blueprint(blueprints.rss, url_prefix='/feeds')

# @app.errorhandler(404)
# def four_oh_four(e):
#     return render_template('404.htm'), 404
