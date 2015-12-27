'use strict';

// import React from 'react';
var React = require('react');
// import { Link } from 'react-router';
var Link = require('react-router').Link;

// import Data from '../data';
var Data = require('../data');
// import ConfirmActionButton from './ConfirmActionButton';
var ConfirmActionButton = require('./ConfirmActionButton');

var DefaultChange = React.createClass({
    handleDeleteClicked: function(callback) {
        Data.changes.delete(this.props.change.id)
            .then(result => {
                if (result.success) {
                    if (this.props.removeCallback) {
                        this.props.removeCallback();
                    }
                }
            })
            .catch(err => {
                if (!this.isMounted()) return;
                callback(false);
            });
    },
    confirmActionButtonConfig: {
        icon: {
            standby: 'glyphicon-trash'
        }
    },
    render: function() {
        return <span>
            <ConfirmActionButton
                className="btn btn-danger btn-xs"
                config={this.confirmActionButtonConfig}
                callback={this.handleDeleteClicked} />
            &nbsp;
            <Link className="btn btn-default btn-xs"
                to={`/changes/${this.props.change.id}/edit`}>
                <span className="glyphicon glyphicon-pencil" />
            </Link>
            &nbsp;
            <Link to={`/changes/${this.props.change.id}`}>
                Datums: {this.props.change.for_date},&nbsp;
                klase: {this.props.change.for_class}
            </Link>
        </span>;
    }
});

module.exports = DefaultChange;
// export default DefaultChange;
