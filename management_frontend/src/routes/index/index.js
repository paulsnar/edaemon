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
    componentDidMount: function() {
        this.data = { version: { } };
        Data.meta.checkUpdates()
        /*jshint -W119 */
        .then(resp => {
            if (!_.isEqual(resp.current_version, resp.latest_version)) {
                this.data.version = {
                    current: resp.current_version.join('.'),
                    latest: resp.latest_version.join('.')
                };
                this.setState({ update: true });
            }
        })
        .catch(err => { /* just do nothing… */ });
        /*jshint +W119 */
    },
    render: function() {
        var _update;
        if (this.state.update) {
            /*jshint ignore:start */
            _update = <div className="alert alert-info">
                Jūsu Edaemon instancei ir pieejams atjauninājums.
                Jūs pašlaik izmantojat versiju {this.data.version.current},
                bet ir pieejama versija {this.data.version.latest}.
                <a href="https://github.com/paulsnar/edaemon">Spiediet šeit</a>,
                lai dotos uz Edaemon Github repozitoriju.
            </div>;
            /*jshint ignore:end */
        }
        /*jshint ignore:start */
        return <div>
            <h1>Pārvaldīšana</h1>
            {_update}
            <div className="row">
                <ChangesColumn className="col-md-6" />
                <TimetablesColumn className="col-md-6" />
            </div>
        </div>;
        /*jshint ignore:end */
    }
});

module.exports = { IndexHandler: IndexHandler };
