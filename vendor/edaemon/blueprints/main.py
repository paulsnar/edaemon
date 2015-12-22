from flask import Blueprint, request, render_template, abort
import json
from datetime import date, timedelta
from google.appengine.ext import ndb

from ..models import Change
from ..utility import (parse_change_subjects, extract_unique_classnames,
    extract_dates, extract_unique_classname_objects)

bp = Blueprint('main', __name__, template_folder='../templates')

@bp.route('/')
def index():
    changes = Change.get_week()
    classNames = sorted(extract_unique_classnames(changes))
    dates = sorted(extract_dates(changes))
    return render_template('change_list.htm', changes=None,
        classNames=classNames, dates=dates)

@bp.route('/class/<class_name>')
def show_class(class_name):
    try:
        first_change = Change.get_first_for_class(class_name)
        return render_template('change.htm', change=first_change,
            subjects=parse_change_subjects(json.loads(first_change.changes)),
            other_changes=Change.get_week_for_class(class_name))
    except Exception:
        return render_template('change_list.htm', className=class_name,
            changes=list())

@bp.route('/date/<date>')
def show_date(date):
    try:
        changes = Change.get_all_for_date(date)
        classNames = extract_unique_classname_objects(changes)
        return render_template('change_list.htm', date=date, changes=None,
            classnameObjects=classNames)
    except Exception:
        return render_template('change_list.htm', date=date, changes=list())

@bp.route('/show/<change_id>')
def show_change(change_id):
    try:
        change_key = ndb.Key(urlsafe=change_id)
        change = change_key.get()
    except Exception:
        return abort(404)

    subjects = parse_change_subjects(json.loads(change.changes))
    return render_template('change.htm', change=change, subjects=subjects)

