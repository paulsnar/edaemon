'use strict';

import { EventEmitter } from 'events';

let _events = new EventEmitter();
let _rpmap = new Map();

let rpc = {
    register(name, callback) {
        _rpmap.set(name, callback);
    },
    unregister(name) {
        _rpmap.delete(name);
    },
    is_registered(name) {
        return _rpmap.has(name);
    },
    call(name, ...args) {
        let _this = args.pop();
        let func = _rpmap.get(name);
        func.apply(_this, args);
    }
}

let events = {
    subscribe(name, callback) {
        _events.addListener(name, callback);
    },
    unsubscribe(name, callback) {
        _events.removeListener(name, callback);
    },
    once(name, callback) {
        _events.once(name, callback);
    },
    publish(name, ...data) {
        _events.emit(name, ...data);
    }
}

export { rpc, events };
