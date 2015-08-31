from flask import Blueprint, request, render_template, abort
import json
from datetime import date, timedelta
from google.appengine.ext import ndb

from .ndbmodels import Change
from .utility import (parse_change_subjects, parse_timetable_subjects,
    extract_unique_classnames)

bp = Blueprint('main', __name__, template_folder='templates')

@bp.route('/')
def index():
    className = request.args.get('class_name')
    if className is None:
        changes = Change.get_week()
        classNames = extract_unique_classnames(changes)
        return render_template('change_list.htm', changes=changes,
            classNames=classNames)
    else:
        return render_template('change_list.htm', className=className,
            changes=Change.get_week_for_class(className))

@bp.route('/show/<change_id>')
def show_change(change_id):
    try:
        change_key = ndb.Key(urlsafe=change_id)
        change = change_key.get()
    except Exception:
        return abort(404)

    subjects = parse_change_subjects(json.loads(change.changes))
    return render_template('change.htm', change=change, subjects=subjects)

@bp.route('/timetable/<timetable_id>')
def show_timetable(timetable_id):
    try:
        timetable_key = ndb.Key(urlsafe=timetable_id)
        timetable = timetable_key.get()
    except Exception:
        return abort(404)

    subjects = parse_timetable_subjects(json.loads(timetable.timetable))
    return render_template('timetable.htm', timetable=timetable,
        subjects=subjects)
