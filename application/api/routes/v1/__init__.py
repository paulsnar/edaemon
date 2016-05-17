# coding: utf-8

from .changes import AllChanges, SpecificChange, ChangesForClass, ChangesForDate
from .trash import TrashHandler
from .notify import NotifyHandler

from ..handler import BaseHandler
class ApiVersionWelcome(BaseHandler):
    def get(self):
        self.jsonify(
            success=True,
            message='Edaemon v1 API welcomes you',
            version=1,
            method_map={
                'changes.all': '/api/v1/changes',
                'changes.one': '/api/v1/changes/<id>',
                'changes.for_date': '/api/v1/changes/for_date/<date>',
                'changes.for_class': '/api/v1/changes/for_class/<class>',
                'trash': '/api/v1/trash'
            }
        )

v1_routes = [
    (r'/api/v1/', ApiVersionWelcome),

    (r'/api/v1/changes', AllChanges),
    (r'/api/v1/changes/([0-9A-Za-z\-_]+)', SpecificChange),
    (r'/api/v1/changes/for_date/([0-9]{4}-[0-9]{2}-[0-9]{2})', ChangesForDate),
    (r'/api/v1/changes/for_class/([0-9A-Za-z\.]+)', ChangesForClass),

    (r'/api/v1/trash', TrashHandler),

    (r'/api/v1/notify', NotifyHandler)
]
