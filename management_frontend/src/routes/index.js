/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');
var Link = require('react-router').Link;
var _ = require('lodash');
var rp = require('../rp');
var Data = require('../data');

var DefaultChange = require('../components/DefaultChange');

var ChangesColumn = React.createClass({
    getInitialState: function() {
        return { loaded: false };
    },
    componentDidMount: function() {
        rp.rpc.call('spinner.start');
        this.data = { };
        /*jshint -W119 */
        Data.changes.getWeek().then(resp => {
        /*jshint +W119 */
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.data.changes = resp.changes;
            this.setState({ loaded: true });
        });
    },
    removeChild: function(change) {
        _.remove(this.data.changes, change);
        this.forceUpdate();
    },
    render: function() {
        var changes;
        if (this.state.loaded) {
            /*jshint ignore:start */
            changes = <ul>
                {this.data.changes.map(change =>
                    <li key={change.id}>
                        <DefaultChange
                            change={change}
                            removeCallback={this.removeChild.bind(this, change)} />
                    </li>
                )}
            </ul>;
            /*jshint ignore:end */
        } else {
            /*jshint ignore:start */
            changes = <p>Vienu mirklīti!</p>;
            /*jshint ignore:end */
        }
        /*jshint ignore:start */
        return <div>
            <h2>Izmaiņas <small>(nedēļai)</small></h2>
            {changes}
            <p>
                <Link to="/changes/all" className="btn btn-default">
                    <span className="glyphicon glyphicon-asterisk" />&nbsp;
                    Skatīt vairāk
                </Link>
                &nbsp;
                <Link to="/changes/new" className="btn btn-primary">
                    <span className="glyphicon glyphicon-plus" />&nbsp;
                    Ievadīt jaunas
                </Link>
            </p>
        </div>;
        /*jshint ignore:end */
    }
});

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
