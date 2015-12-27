/*jshint -W097 */
'use strict';
/* globals fetch */

// TODO: caching

function check200(resp) {
    if (resp.status >= 200 && resp.status < 300) {
        return resp;
    } else {
        var err = new Error(resp.statusText);
        err.response = resp;
        throw err;
    }
}

var changes = {
    /*jshint -W119 */
    get: function(id) {
        return fetch(`/api/changes/${id}`,
            { credentials: 'same-origin' })
            .then(check200)
            .then(r => r.json());
    },
    /*jshint +W119 */
    getWeek: function() {
        return fetch('/api/changes/week',
            { credentials: 'same-origin' })
            .then(check200)
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    },
    getAll: function(cursor) {
        var p;
        /*jshint -W119 */
        if (cursor) {
            p = fetch(`/api/changes/all?cursor=${cursor}`,
                { credentials: 'same-origin' });
            /*jshint +W119 */
        } else {
            p = fetch('/api/changes/all',
                { credentials: 'same-origin' });
        }
        return p
            .then(check200)
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    },
    /*jshint -W119 */
    delete: function(id) {
        return fetch(`/api/changes/${id}`,
            { method: 'delete', credentials: 'same-origin' })
            .then(r => r.json());
    },
    /*jshint +W119 */
    input: function(data) {
        return fetch('/api/changes',
            { method: 'post', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) })
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    }
};

module.exports = {
    changes: changes
};
