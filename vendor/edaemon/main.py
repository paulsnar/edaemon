from flask import Blueprint, render_template, abort
import json
from datetime import date, timedelta
from google.appengine.ext import ndb

from .ndbmodels import Change

bp = Blueprint('main', __name__, template_folder='templates')

def _parse_subjects(_s):
    subjectsobj = _s
    for i in reversed(subjectsobj):
        if i is None:
            subjectsobj.pop(-1)
        else:
            break
    if subjectsobj is None:
        return []
    else:
        return subjectsobj

@bp.route('/')
def index():
    return render_template('index.htm', changes=Change.get_week())

@bp.route('/show/<change_id>')
def show_change(change_id):
    try:
        change_key = ndb.Key(urlsafe=change_id)
        change = change_key.get()
    except Exception:
        return abort(404)

    subjects = _parse_subjects(json.loads(change.changes))
    return render_template('change.htm', change=change, subjects=subjects)

