'use strict';

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { rpc, events } from '../rp';
import Data from '../data';

import { Change } from './index';

let AllChangesHandler = React.createClass({
    getInitialState() {
        return { loaded: false, changes: null };
    },
    componentDidMount() {
        events.publish('spinner.start');
        this.data = { };
        Data.changes.getAll().then(resp => {
            events.publish('spinner.stop');
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
    removeChild(change) {
        _.remove(this.data.changes, change);
        this.forceUpdate();
    },
    loadMore() {
        events.publish('spinner.start');
        Data.changes.getAll(this.state.cursor).then(resp => {
            events.publish('spinner.stop');
            this.data.changes = this.data.changes.concat(resp.changes);
            if (resp.cursor) {
                this.setState({ cursor: resp.cursor });
            } else {
                this.setState({ cursor: null });
            }
        });
    },
    render() {
        let changes, loadMore;
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

export { AllChangesHandler };
