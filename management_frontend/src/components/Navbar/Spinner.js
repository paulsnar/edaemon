/*jshint -W097 */
'use strict';

var React = require('react');
var Spin = require('spin');

var rp = require('../../rp');

var Spinner = React.createClass({
    componentDidMount: function() {
        this.spinner = new Spin({
            length: 6,
            width: 3,
            radius: 9,
            color: '#ffffff',
            position: 'absolute',
            left: '50%',
            top: '50%',
            shadow: true,
            hwaccel: true
        });
        this._s = 0;
        rp.events.subscribe('spinner.start', this.startSpinner);
        rp.events.subscribe('spinner.stop', this.stopSpinner);
    },
    startSpinner: function() {
        // this spinner is a semaphore
        this._s++;
        if (this._s > 0) {
            this.spinner.spin(this.refs.spinner);
        }
    },
    stopSpinner: function() {
        this._s--;
        if (this._s <= 0) {
            this.spinner.stop();
        }
    },
    render: function() {
        /*jshint ignore:start */
        return <a
            ref="spinner"
            className="disabled"
            style={{ color: 'transparent' }}>
            &nbsp;
        </a>;
        /*jshint ignore:end */
    }
});

// export { Spinner };
module.exports = { Spinner: Spinner };
