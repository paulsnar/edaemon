/*jshint -W097 */
'use strict';
/* globals fetch, Promise */

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
        if (!id || id.trim() === '') {
            return new Promise((res, rej) => {
                rej(new Error('No id specified'));
            });
        } else {
            return fetch(`/admin/api/changes/${id}`,
                { credentials: 'same-origin' })
                .then(check200)
                .then(r => r.json());
        }
    },
    /*jshint +W119 */
    getWeek: function() {
        return fetch('/admin/api/changes/week',
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
            p = fetch(`/admin/api/changes/all?cursor=${cursor}`,
                { credentials: 'same-origin' });
            /*jshint +W119 */
        } else {
            p = fetch('/admin/api/changes/all',
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
        if (!id || id.trim() === '') {
            return new Promise((res, rej) => {
                rej(new Error('No id specified'));
            });
        } else {
            return fetch(`/admin/api/changes/${id}`,
                { method: 'delete', credentials: 'same-origin' })
                .then(r => r.json());
        }
    },
    /*jshint +W119 */
    input: function(data) {
        return fetch('/admin/api/changes',
            { method: 'post', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) })
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    },
    edit: function(id, data) {
        return fetch(`/admin/api/changes/${id}`,
            { method: 'put', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) })
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    }
};

var timetables = {
    /*jshint -W119 */
    get: function(id) {
        if (!id || id.trim() === '') {
            return new Promise((res, rej) => {
                rej(new Error('No id specified'));
            });
        } else {
            return fetch(`/admin/api/timetables/${id}`,
                { credentials: 'same-origin' })
                .then(check200)
                .then(r => r.json());
        }
    },
    /*jshint +W119 */
    /*jshint -W119 */
    getForClass: function(forClass) {
        if (!forClass || forClass.trim() === '') {
            return new Promise((res, rej) => {
                rej(new Error('No class specified'));
            });
        } else {
            return fetch(`/admin/api/timetables/for_class/${forClass}`,
                { credentials: 'same-origin' })
                .then(check200)
                .then(r => r.json());
        }
    },
    /*jshint +W119 */
    getAll: function(cursor) {
        var p;
        /*jshint -W119 */
        if (cursor) {
            p = fetch(`/admin/api/timetables/all?cursor=${cursor}`,
                { credentials: 'same-origin' });
        } else {
            p = fetch('/admin/api/timetables/all', { credentials: 'same-origin' });
        }
        /*jshint +W119 */
        return p
            .then(check200)
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    },
    delete: function(id) {
        if (!id || id.trim() === '') {
            /*jshint -W119 */
            return new Promise((res, rej) => {
                rej(new Error('No id specified'));
            });
            /*jshint +W119 */
        } else {
            /*jshint -W119 */
            return fetch(`/admin/api/timetables/${id}`,
                { method: 'delete', credentials: 'same-origin' })
                .then(r => r.json());
            /*jshint +W119 */
        }
    },
    input: function(data) {
        return fetch('/admin/api/timetables',
            { method: 'post', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) })
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    },
    edit: function(id, data) {
        return fetch(`/admin/api/timetables/${id}`,
            { method: 'put', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) })
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    }
};

var meta = {
    checkUpdates: function() {
        return fetch('/admin/api/check_updates',
            { credentials: 'same-origin' })
            .then(check200)
            /*jshint -W119 */
            .then(r => r.json());
            /*jshint +W119 */
    }
};

module.exports = {
    changes: changes,
    timetables: timetables,
    meta: meta
};
