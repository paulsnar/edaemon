'use strict';

const defaults = {
    cozyMode: false,
    fixedHeight: false
}

const names = {
    cozyMode: 'Kompaktais platuma režīms',
    fixedHeight: 'Izmantot nedinamisku augstumu izmaiņu ievadei'
}

const Settings = {
    init: () => {
        if (!window.localStorage.getItem('EDAEMON_SETTINGS_SCHEMA')) {
            try {
                window.localStorage.setItem('EDAEMON_SETTINGS_SCHEMA', '1');
            } catch (e) {
                return false;
            }
            Object.keys(defaults).forEach(key => {
                window.localStorage.setItem(key, JSON.stringify(defaults[key]));
            });
        }
    },
    get: name => {
        return new Promise((resolve, reject) => {
            let res = window.localStorage.getItem(name);
            resolve(JSON.parse(res));
        });
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            let settings = { };
            Object.keys(defaults).forEach(key => {
                let item = window.localStorage.getItem(key);
                settings[key] = JSON.parse(item);
            });
            resolve(settings);
        });
    },
    set: (name, value) => {
        console.log('[settings] setting', name, 'to', value);
        return new Promise((resolve, reject) => {
            try {
                window.localStorage.setItem(name, JSON.stringify(value));
                resolve(true);
            } catch (e) {
                resolve(false);
            }
        });
    },
    defaults,
    names
}

export default Settings;
