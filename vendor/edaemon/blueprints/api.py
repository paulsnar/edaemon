# coding: utf-8
from flask import Blueprint, request, make_response, jsonify

from ..models import Class

bp = Blueprint('api', __name__)

@bp.route('/')
def index():
    response = make_response(u'🙅 no 🙅')
    response.headers['Content-Type'] = 'text/plain; charset=utf-8'
    return response

@bp.route('/classes')
def get_all_classes():
    return jsonify(classes=Class.get_all())
