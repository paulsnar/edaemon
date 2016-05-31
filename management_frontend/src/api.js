'use strict';

import 'whatwg-fetch';

const API = {
    Change: {
        post(data) {
            let ret = fetch('/api/v1/changes', {
                credentials: 'same-origin',
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .catch(err => {
                console.error('[api] error', err,
                    'on request: POST /api/v1/changes');
            });

            ret.then(body => {
                if (!body.success) {
                    console.warn('[api] unsuccessful operation',
                        'on request: POST /api/v1/changes');
                    console.debug('[api] included body:', body);
                }
            });

            return ret;
        },
        put(id, data) {
            let ret = fetch(`/api/v1/changes/${id}`, {
                credentials: 'same-origin',
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .catch(err => {
                console.error('[api] error', err,
                    `on request: PUT /api/v1/changes/${id}`);
            });

            ret.then(body => {
                if (!body.success) {
                    console.warn('[api] unsuccessful operation',
                        `on request: PUT /api/v1/changes/${id}`);
                    console.debug('[api] included body:', body);
                }
            });

            return ret.then(body => body.success);
        },
        delete(id) {
            let ret = fetch(`/api/v1/changes/${id}`, {
                credentials: 'same-origin',
                method: 'DELETE'
            })
            .then(res => res.json())
            .catch(err => {
                console.error('[api] error', err,
                    `on request: DELETE /api/v1/changes/${id}`);
            });

            ret.then(body => {
                if (!body.success) {
                    console.warn('[api] unsuccessful operation',
                        `on request: DELETE /api/v1/changes/${id}`);
                    console.debug('[api] included body:', body);
                }
            });

            return ret.then(body => body.success);
        },
        undelete(id) {
            let ret = fetch(`/api/v1/trash`, {
                credentials: 'same-origin',
                method: 'POST',
                body: JSON.stringify({
                    action: 'undelete',
                    kind: 'Change',
                    id
                }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .catch(err => {
                console.error('[api] error', err,
                    'on request: POST /api/v1/trash');
            });

            ret.then(body => {
                if (!body.success) {
                    console.warn('[api] unsuccessful operation',
                        `on request: DELETE /api/v1/trash`);
                    console.debug('[api] included body:', body);
                }
            });

            return ret.then(body => body.success);
        }
    }
}

module.exports = API;
