'use strict';

var _ = require('lodash');

function SerializationError(message) {
    if (message) {
        this.message = message;
    }
    Error.apply(this, arguments);
}

SerializationError.prototype = _.create(Error.prototype, {
    constructor: SerializationError
});

module.exports = SerializationError;
