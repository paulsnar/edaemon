/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');

var _ = require('lodash');
var Data = require('../../data');

var ChangesColumn = require('./ChangesColumn');
var TimetablesColumn = require('./TimetablesColumn');

var IndexHandler = React.createClass({
    getInitialState: function() {
        return { update: false };
    },
    render: function() {
        /*jshint ignore:start */
        return <div>
            <h1>Pārvaldīšana</h1>
            <div className="row">
                <ChangesColumn className="col-md-6" />
                <TimetablesColumn className="col-md-6" />
            </div>
        </div>;
        /*jshint ignore:end */
    }
});

module.exports = { IndexHandler: IndexHandler };
