'use strict';

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

import { formatDate } from '../i18n';
import { rpc, events } from '../rp';
import Data from '../data';

let ChangeHandler = React.createClass({
    componentDidMount() {
        events.publish('spinner.start');
        this.data = { };
        Data.changes.get(this.props.params.id).then(change => {
            events.publish('spinner.stop');
            if (!this.isMounted()) return;
            this.data.change = change.change;
            this.setState({ loaded: true });
        }).catch(err => {
            events.publish('spinner.stop');
            console.log(err);
            if (!this.isMounted()) return;
            this.setState({ error: err });
        });
    },
    getInitialState() {
        return { loaded: false };
    },
    render() {
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

export { ChangeHandler };
