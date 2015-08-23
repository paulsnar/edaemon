from flask import Blueprint, request, render_template, abort, session, redirect,\
    url_for
from werkzeug.security import generate_password_hash, check_password_hash
from google.appengine.ext import ndb
import datetime
import json
from uuid import uuid4 as uuid

from .ndbmodels import User, Change, _format_date_ISO8601

bp = Blueprint('admin', __name__, template_folder='templates')

def _parse_changes(form):
    _0 = form.get('subject_0', None)
    if type(_0) == unicode:
        if _0 == u'-' or _0 == u'': _0 = None
    _1 = form.get('subject_1', None)
    if type(_1) == unicode:
        if _1 == u'-' or _1 == u'': _1 = None
    _2 = form.get('subject_2', None)
    if type(_2) == unicode:
        if _2 == u'-' or _2 == u'': _2 = None
    _3 = form.get('subject_3', None)
    if type(_3) == unicode:
        if _3 == u'-' or _3 == u'': _3 = None
    _4 = form.get('subject_4', None)
    if type(_4) == unicode:
        if _4 == u'-' or _4 == u'': _4 = None
    _5 = form.get('subject_5', None)
    if type(_5) == unicode:
        if _5 == u'-' or _5 == u'': _5 = None
    _6 = form.get('subject_6', None)
    if type(_6) == unicode:
        if _6 == u'-' or _6 == u'': _6 = None
    _7 = form.get('subject_7', None)
    if type(_7) == unicode:
        if _7 == u'-' or _7 == u'': _7 = None
    _8 = form.get('subject_8', None)
    if type(_8) == unicode:
        if _8 == u'-' or _8 == u'': _8 = None
    return [_0, _1, _2, _3, _4, _5, _6, _7, _8]

@bp.route('/')
def index():
    if 'email' in session:
        return render_template('admin/index.j2')
    else:
        return redirect(url_for('.login'))

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if 'email' in session:
        return redirect(url_for('.index'))
    elif request.method == 'POST':
        if (not request.form.get('_xsrf', False)) or \
        (not session.get('xsrf', False)):
            # well please log in properly -.-
            print '[login:XSRF] Could not find one of form components'
            return redirect(url_for('.login'))
        elif str(request.form['_xsrf']) != session['xsrf']:
            print '[login:XSRF] components did not match'
            return redirect(url_for('.login'))
        else:
            # print '[login:XSRF] okay'
            session.pop('xsrf') # apparently valid

        try:
            user = User.lookup(request.form['email'])
        except Exception:
            return render_template('admin/login.j2')

        if check_password_hash(user.passwd, request.form['passwd']):
            session['email'] = request.form['email']
            return redirect(url_for('.index'))
        else:
            return render_template('admin/login.j2')
    else:
        session['xsrf'] = uuid().hex
        return render_template('admin/login.j2')

@bp.route('/logout')
def logout():
    if 'email' in session:
        session.pop('email', None)
    return redirect(url_for('.login'))

@bp.route('/changes/')
def list_changes():
    if not 'email' in session: return redirect(url_for('.login'))
    return render_template('admin/list_changes.j2', changes=Change.get_all())

@bp.route('/changes/delete/<change_id>', methods=['GET', 'POST'])
def delete_change(change_id):
    if not 'email' in session: return redirect(url_for('.login'))
    elif request.method == 'POST':
        Change.delete(change_id)
        return redirect(url_for('.list_changes'))
    else:
        try:
            change = Change.lookup(change_id)
        except Exception:
            return render_template('admin/delete_change.j2', error=True)
        return render_template('admin/delete_change.j2',
            change=Change.lookup(change_id))

@bp.route('/changes/new', methods=['GET', 'POST'])
def enter_change():
    if not 'email' in session: return redirect(url_for('.login'))
    elif request.method == 'POST':
        date = str(request.form['date'])
        className = str(request.form['className'])
        changes = _parse_changes(request.form)
        change = Change(date=date, className=className,
            changes=json.dumps(changes))
        key = change.put()
        return redirect(url_for('main.show_change', change_id=key.urlsafe()))
    else:
        date = datetime.date.today()
        today = _format_date_ISO8601(date)
        return render_template('admin/new_change.j2', today=today)
