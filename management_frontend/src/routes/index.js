'use strict';

// import React from 'react';
var React = require('react');
// import { Link } from 'react-router';
var Link = require('react-router').Link;
// import _ from 'lodash';
var _ = require('lodash');
// import { rpc, events } from '../rp';
var rp = require('rp');
// import Data from '../data';
var Data = require('../data');

// import DefaultChange from '../components/DefaultChange';
var DefaultChange = require('../components/DefaultChange');

var ChangesColumn = React.createClass({
    getInitialState() {
        return { loaded: false };
    },
    componentDidMount() {
        rp.events.publish('spinner.start');
        this.data = { };
        Data.changes.getWeek().then(resp => {
            rp.events.publish('spinner.stop');
            if (!this.isMounted()) return;
            this.data.changes = resp.changes;
            this.setState({ loaded: true });
        });
    },
    removeChild(change) {
        _.remove(this.data.changes, change);
        this.forceUpdate();
    },
    render() {
        var changes;
        if (this.state.loaded) {
            changes = <ul>
                {this.data.changes.map(change =>
                    <li key={change.id}>
                        <DefaultChange
                            change={change}
                            removeCallback={this.removeChild.bind(this, change)} />
                    </li>
                )}
            </ul>;
        } else {
            changes = <p>Vienu mirklīti!</p>;
        }
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
    }
});

var IndexHandler = React.createClass({
    render() {
        return <div>
            <h1>Pārvaldīšana</h1>
            <div className="row">
                <ChangesColumn className="col-md-6" />
            </div>
        </div>;
    }
});

// export { IndexHandler };
module.exports = { IndexHandler: IndexHandler };
