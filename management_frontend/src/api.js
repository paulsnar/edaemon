'use strict';

import 'whatwg-fetch';

const API = {
    Change: {
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
        }
    }
}

module.exports = API;
