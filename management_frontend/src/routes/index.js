'use strict';

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { rpc, events } from '../rp';
import Data from '../data';

let Change = React.createClass({
    getInitialState() {
        return { deleteConfirm: false, deleting: false, deletionError: false };
    },
    handleDeleteClicked() {
        if (this.state.deleting) {
            // noop!
        } else if (this.state.deleteConfirm) {
            this.setState({ deleteConfirm: false, deleting: true });
            Data.changes.delete(this.props.change.id)
                .then(result => {
                    if (result.success) {
                        this.props.removeSelfCallback();
                    }
                })
                .catch(err => {
                    if (!this.isMounted()) return;
                    this.setState({ deleting: false, deletionError: true });
                })
        } else {
            this.setState({ deletionError: false, deleteConfirm: true });
        }
    },
    render() {
        let _deleteText, _iconClass, _disabled = false;
        if (this.state.deleteConfirm) {
            _deleteText = 'Tiešām?';
            _iconClass = 'glyphicon-trash';
        } else if (this.state.deletionError) {
            _deleteText = 'Neizdevās!';
            _iconClass = 'glyphicon-alert';
        } else if (this.state.deleting) {
            _deleteText = 'Vienu mirklīti...';
            _iconClass = 'glyphicon-cog _spin';
            _disabled = true;
        } else {
            _deleteText = '';
            _iconClass = 'glyphicon-trash';
        }
        return <li style={{ padding: '0.5rem' }}>
            <button
                className={`btn btn-danger btn-xs ${_disabled ? 'disabled':''}`}
                onClick={this.handleDeleteClicked}>
                <span className={`glyphicon ${_iconClass}`} /> {_deleteText}
            </button>
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
        </li>;
    }
});

let ChangesColumn = React.createClass({
    getInitialState() {
        return { loaded: false };
    },
    componentDidMount() {
        events.publish('spinner.start');
        this.data = { };
        Data.changes.getWeek().then(resp => {
            events.publish('spinner.stop');
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
        let changes;
        if (this.state.loaded) {
            changes = <ul>
                {this.data.changes.map(change =>
                    <Change
                        key={change.id}
                        change={change}
                        removeSelfCallback={this.removeChild.bind(this, change)} />
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

let IndexHandler = React.createClass({
    render() {
        return <div>
            <h1>Pārvaldīšana</h1>
            <div className="row">
                <ChangesColumn className="col-md-6" />
            </div>
        </div>;
    }
});

export { Change, IndexHandler };
