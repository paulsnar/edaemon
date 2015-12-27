'use strict';

// import React from 'react';
var React = require('react');
// import { Link } from 'react-router';
var Link = require('react-router').Link;
// import _ from 'lodash';
var _ = require('lodash');

// import { formatDate } from '../i18n';
var formatDate = require('../i18n').formatDate;
// import { rpc, events } from '../rp';
var rp = require('../rp');
// import Data from '../data';
var Data = require('../data');

var ChangeHandler = React.createClass({
    componentDidMount: function() {
        rp.events.publish('spinner.start');
        this.data = { };
        Data.changes.get(this.props.params.id).then(change => {
            rp.events.publish('spinner.stop');
            if (!this.isMounted()) return;
            this.data.change = change.change;
            this.setState({ loaded: true });
        }).catch(err => {
            rp.events.publish('spinner.stop');
            console.log(err);
            if (!this.isMounted()) return;
            this.setState({ error: err });
        });
    },
    getInitialState: function() {
        return { loaded: false };
    },
    render: function() {
        if (this.state.loaded) {
            return <div>
                <h1>Izmaiņas {this.data.change.for_class} klasei</h1>
                <div>
                    {/* shut up */}
                </div>
                <p><strong>Datums:</strong> {formatDate(this.data.change.for_date)}</p>
                <ol start="0">
                {this.data.change.lessons.map((lesson, i) =>
                <li key={i}>
                    {lesson || '–'}
                </li>
                )}
                </ol>
            </div>;
        } else if (this.state.error) {
            return <div>
                <div className="alert alert-danger">
                    <strong>Ak vai!</strong>&nbsp;
                    Mēģinot parādīt šo lapu, radās kļūda:&nbsp;
                    <code>{`${this.state.error}`}</code>
                </div>
            </div>;
        } else {
            return <div>
                <h1>Izmaiņas … klasei</h1>
                <p>Notiek ielāde…</p>
            </div>;
        }
    }
});

// export { ChangeHandler };
module.exports = { ChangeHandler: ChangeHandler };
