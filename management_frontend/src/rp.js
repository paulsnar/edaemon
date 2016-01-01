/*jshint -W097 */
'use strict';

/* globals Map */

var events = require('events');
var EventEmitter = events.EventEmitter;

var _ = require('lodash');

var _events = new EventEmitter();
var _rpmap = new Map();

var rpc = {
    register: function(name, callback) {
        _rpmap.set(name, callback);
    },
    unregister: function(name) {
        _rpmap.delete(name);
    },
    isRegistered: function(name) {
        return _rpmap.has(name);
    },
    call: function() {
        var name = _.first(arguments);
        var args = _.drop(arguments, 1);

        if (!rpc.isRegistered(name)) {
            throw new Error('Attempted to call a nonexistant RPC');
        }

        var func = _rpmap.get(name);
        func.apply(func.__context__ || null, args);
    }
};

var events = {
    subscribe: function(name, callback) {
        _events.addListener(name, callback);
    },
    unsubscribe: function(name, callback) {
        _events.removeListener(name, callback);
    },
    once: function(name, callback) {
        _events.once(name, callback);
    },
    publish: function() {
        // sign: name, ...date
        var name = _.first(arguments);
        var args = _.drop(arguments, 1);

        // _events.emit(name, ...data);
        _events.emit.apply(_events, [name].concat(args));
    },
    subscribers: function(name) {
        return _events.listenerCount(name);
    }
};

module.exports = { rpc: rpc, events: events };
