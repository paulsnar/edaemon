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
    is_registered: function(name) {
        return _rpmap.has(name);
    },
    call: function() {
        // sign: (name, ...args, _this)
        var name = _.first(arguments);
        var args = _(arguments).drop(1).dropRight(1).value();
        var _this = _.last(arguments);

        var func = _rpmap.get(name);
        func.apply(_this, args);
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
    }
};

module.exports = { rpc: rpc, events: events };
