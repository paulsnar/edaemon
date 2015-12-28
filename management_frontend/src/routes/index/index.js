/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');

var ChangesColumn = require('./ChangesColumn');

var IndexHandler = React.createClass({
    render: function() {
        /*jshint ignore:start */
        return <div>
            <h1>Pārvaldīšana</h1>
            <div className="row">
                <ChangesColumn className="col-md-6" />
            </div>
        </div>;
        /*jshint ignore:end */
    }
});

module.exports = { IndexHandler: IndexHandler };
