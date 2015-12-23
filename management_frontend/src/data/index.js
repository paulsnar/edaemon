'use strict';

// TODO: caching

function check200(resp) {
    if (resp.status >= 200 && resp.status < 300) {
        return resp;
    } else {
        let err = new Error(resp.statusText);
        err.response = resp;
        throw err;
    }
}

let changes = {
    get(id) {
        return fetch(`/api/changes/${id}`,
            { credentials: 'same-origin' })
            .then(check200)
            .then(r => r.json());
    },
    getWeek() {
        return fetch('/api/changes/week',
            { credentials: 'same-origin' })
            .then(check200)
            .then(r => r.json());
    },
    getAll(cursor) {
        let p;
        if (cursor) {
            p = fetch(`/api/changes/all?cursor=${cursor}`,
                { credentials: 'same-origin' });
        } else {
            p = fetch('/api/changes/all',
                { credentials: 'same-origin' });
        }
        return p
            .then(check200)
            .then(r => r.json());
    },
    delete(id) {
        return fetch(`/api/changes/${id}`,
            { method: 'delete', credentials: 'same-origin' })
            .then(r => r.json());
    },
    input(data) {
        return fetch('/api/changes',
            { method: 'post', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) })
            .then(r => r.json());
    }
}

let Data = {
    changes
};

export default Data;
