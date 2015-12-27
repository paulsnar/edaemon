'use strict';

// import React from 'react';
var React = require('react');
// import { Link } from 'react-router';
var Link = require('react-router').Link;
// import _ from 'lodash';
var _ = require('lodash');
// import { rpc, events } from '../rp';
var rp = require('../rp');
// import Data from '../data';
var Data = require('../data');

// import DefaultChange from '../components/DefaultChange';
var DefaultChange = require('../components/DefaultChange');

var AllChangesHandler = React.createClass({
    getInitialState: function() {
        return { loaded: false, changes: null };
    },
    componentDidMount: function() {
        rp.events.publish('spinner.start');
        this.data = { };
        Data.changes.getAll().then(resp => {
            rp.events.publish('spinner.stop');
            if (!this.isMounted()) return;
            this.data.changes = resp.changes;
            if (resp.cursor) {
                this.setState({ loaded: true, cursor: resp.cursor });
            } else {
                this.setState({ loaded: true, cursor: null });
            }
        }).catch(err => {
            this.setState({ error: err });
        });
    },
    removeChild: function(change) {
        _.remove(this.data.changes, change);
        this.forceUpdate();
    },
    loadMore: function() {
        rp.events.publish('spinner.start');
        Data.changes.getAll(this.state.cursor).then(resp => {
            rp.events.publish('spinner.stop');
            if (!this.isMounted()) return;
            this.data.changes = this.data.changes.concat(resp.changes);
            if (resp.cursor) {
                this.setState({ cursor: resp.cursor });
            } else {
                this.setState({ cursor: null });
            }
        });
    },
    render: function() {
        let changes, loadMore;
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
            changes = <p>Vienu mirklīti…</p>
        }
        if (this.state.cursor) {
            loadMore = <button className="btn btn-default" onClick={this.loadMore}>
                <span className="glyphicon glyphicon-asterisk" /> Ielādēt vairāk
            </button>;
        }
        return <div>
            <h1>Visas izmaiņas</h1>
            {changes}
            {loadMore}
        </div>;
    }
});

// export { AllChangesHandler };
module.exports = { AllChangesHandler: AllChangesHandler };
