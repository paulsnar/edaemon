from flask import (Blueprint, request, render_template, abort, session,
    redirect, url_for, current_app, jsonify)
from werkzeug.security import generate_password_hash, check_password_hash
from google.appengine.ext import ndb
from datetime import date
import json
from uuid import uuid4 as uuid
import logging

from ..models import User, Change
from ..utility import (parse_change_subjects_for_form,
    parse_change_subjects_from_form, format_date_ISO8601)

bp = Blueprint('admin', __name__, template_folder='../templates')

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if 'email' in session: return redirect(url_for('.list_changes'))
    elif User.count() == 0:
        return redirect(url_for('.initial_setup'))
    elif request.method == 'POST':
        if request.form.get('_xsrf') is None or session.get('xsrf') is None:
            # well please log in properly -.-
            if not current_app.config.get('silent'):
                logging.warning(
                    'XSRF: Could not find one or more form components')
            return redirect(url_for('.login'))
        elif request.form['_xsrf'].decode('utf-8') != session['xsrf']:
            if not current_app.config.get('silent'):
                logging.warning('XSRF: Components did not match')
            return redirect(url_for('.login'))
        else:
            session.pop('xsrf') # apparently valid

        try:
            user = User.lookup(request.form['email'])
        except Exception:
            return render_template('admin/login.htm')

        if check_password_hash(user.passwd, request.form['passwd']):
            session['email'] = request.form['email']
            return redirect(url_for('.list_changes'))
        else:
            return render_template('admin/login.htm')
    else:
        session['xsrf'] = uuid().hex
        return render_template('admin/login.htm')

@bp.route('/logout')
def logout():
    if 'email' in session:
        session.pop('email', None)
    return redirect(url_for('.login'))

@bp.route('/changes/')
def list_changes():
    if not 'email' in session: return redirect(url_for('.login'))
    return render_template('admin/list_changes.htm', changes=Change.get_all())

@bp.route('/changes/cleanup.json', methods=['POST'])
def cleanup_changes():
    if not 'email' in session: return jsonify(error=401, description="Not authorized")
    else:
        changes = Change.get_all()
        today = date.today()
        for change in changes:
            try:
                _date = date(int(change.date[0:4]), int(change.date[5:7]), int(change.date[8:10]))
                if _date.year <= today.year and \
                    _date.month <= today.month and \
                    _date.day < today.day:
                    change.key.delete()
            except ValueError:
                change.key.delete()
        return jsonify(ok=True)

@bp.route('/changes/delete/<change_id>', methods=['GET', 'POST'])
def delete_change(change_id):
    if not 'email' in session: return redirect(url_for('.login'))
    elif request.method == 'POST':
        Change.delete(change_id)
        return redirect(url_for('.list_changes'))
    else:
        try:
            return render_template('admin/delete_change.htm',
                change=Change.lookup(change_id))
        except Exception:
            return render_template('admin/delete_change.htm', error=True)

@bp.route('/changes/edit/<change_id>', methods=['GET', 'POST'])
def modify_change(change_id):
    if not 'email' in session: return redirect(url_for('.login'))
    elif request.method == 'POST':
        try:
            change = Change.lookup(change_id)
        except Exception:
            return redirect(url_for('.edit_change'))
        change.className = request.form['className']
        change.date = request.form['date']
        change.changes = json.dumps(
            parse_change_subjects_from_form(request.form))
        change.put()
        return redirect(url_for('main.show_change', change_id=change_id))
    else:
        try:
            change = Change.lookup(change_id)
        except Exception:
            return redirect(url_for('.enter_change'))
        return render_template('admin/edit_change.htm', change=change,
            subjects=parse_change_subjects_for_form(json.loads(change.changes)))

@bp.route('/changes/new', methods=['GET', 'POST'])
def enter_change():
    if not 'email' in session: return redirect(url_for('.login'))
    elif request.method == 'POST':
        if request.form.get('multi') == u'indeed':
            classes = request.form['classes'].split(u',')
            ids = []
            day = request.form['date']
            for className in classes:
                changes = []
                for i in xrange(0, 9):
                    change = request.form.get('class_{0}_change_{1}'.format(
                        className, i))
                    if type(change) == unicode and \
                    change == u'-' or change == u'':
                        changes.append(None)
                    else:
                        changes.append(change)
                change = Change(date=day, className=className,
                    changes=json.dumps(changes)).put()
                ids.append(change.urlsafe())
            return jsonify(ok=True, ids=ids)
        else:
            day = request.form['date']
            className = request.form['className']
            changes = parse_change_subjects_from_form(request.form)
            change = Change(date=day, className=className,
                changes=json.dumps(changes))
            key = change.put()
            return redirect(url_for('main.show_change',
                change_id=key.urlsafe()))
    else:
        today = format_date_ISO8601(date.today())
        return render_template('admin/new_change.htm', today=today,
            multi_mode=not not request.args.get('multi', False))

@bp.route('/users/add', methods=['GET', 'POST'])
def create_user():
    if not 'email' in session: return redirect(url_for('.login'))
    elif request.method == 'POST':
        email = request.form['email']
        if User.email_exists(email):
            return render_template('admin/create_user.htm', error=True,
                email=request.form['email'])
        elif request.form['password1'] != request.form['password2']:
            return render_template('admin/create_user.htm', mismatch=True,
                email=request.form['email'])
        else:
            passwd = generate_password_hash(request.form['password1'])
            user = User(email=email, passwd=passwd)
            key = user.put()
            return render_template('admin/create_user.htm', success=True)
    else:
        return render_template('admin/create_user.htm')

@bp.route('/password', methods=['GET', 'POST'])
def change_passwd():
    if not 'email' in session: return redirect(url_for('.login'))
    elif request.method == 'POST':
        pw_1 = request.form['passwd1']
        pw_2 = request.form['passwd2']
        if pw_1 != pw_2:
            return render_template('admin/change_passwd.htm', mismatch=True)
        else:
            user = User.lookup(session['email'])
            user.passwd = generate_password_hash(pw_1)
            user.put()
            return render_template('admin/change_passwd.htm', success=True)
    else:
        return render_template('admin/change_passwd.htm')

@bp.route('/plans')
def show_plans():
    return render_template('admin/show_plans.htm')

@bp.route('/plans/input', methods=['GET', 'POST'])
def input_plan():
    pass

@bp.route('/setup', methods=['GET', 'POST'])
def initial_setup():
    if 'email' in session or \
    User.count() != 0: return redirect(url_for('.list_changes'))
    elif request.method == 'POST':
        pw_1 = request.form['passwd1']
        pw_2 = request.form['passwd2']
        if pw_1 != pw_2:
            return render_template('admin/initial_setup.htm', mismatch=True,
                email=request.form['email'])
        else:
            User(email=request.form['email'],
                passwd=generate_password_hash(pw_1)).put()
            session['email'] = request.form['email']
            return redirect(url_for('.list_changes'))
    else:
        return render_template('admin/initial_setup.htm')