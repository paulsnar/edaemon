'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import API from './api';
import Settings from './settings';

import { isValidISO8601 } from './common';

import EntryColumn from './components/EntryColumn';

const times = num => {
    let r = [ ], i = -1;
    while (++i < num) r.push(i);
    return r;
}

class ChangeEntryPaneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.data = {
            date: ''
        }
        this.state = {
            dateHasErrors: false,
            classNamesHaveErrors: false,
            saving: false,
            saveError: false,
            columns: 1
        }
    }
    _handleDateChange(e) {
        this.data.date = e.target.value;
        this.setState({ dateHasErrors: !isValidISO8601(this.data.date) });
    }
    _handleSaveClicked() {
        if (this.state.saving) return;
        // check for validation
        let dateIsValid = isValidISO8601(this.data.date);
        if (!dateIsValid && !this.state.dateHasErrors) {
            this.setState({ dateHasErrors: true });
            return;
        }
        if (!dateIsValid) return;

        let items = [ ];
        for (var i = this.state.columns - 1; i >= 0; i--) {
            let isValid = this.refs[`column${i}`].validate();
            if (isValid === null) {
                continue; // empty column
            } else if (isValid === false) {
                this.setState({ classNamesHaveErrors: true });
                return;
            } else {
                let data = this.refs[`column${i}`].serialize();
                items.push({
                    for_class: data.className,
                    lessons: data.lessons
                });
            }
        }
        if (items.length === 0) {
            this.setState({ classNamesHaveErrors: true });
            return;
        } else {
            this.setState({ classNamesHaveErrors: false });
        }

        this.setState({ saving: true });
        API.Change.post({
            for_date: this.data.date,
            items
        })
        .then(body => {
            if (body.success) {
                window.setTimeout(() => {
                    // give time for memcache to catch up
                    this.setState({ saving: false });
                    window.location.assign('/admin/changes/all');
                }, 500)
            } else {
                this.setState({ saving: false, saveError: true });
            }
        });
    }
    _addColumn() {
        let { columns } = this.state;
        columns++;
        this.setState({ columns });
    }
    render() {
        let _errors;
        if (this.state.dateHasErrors || this.state.classNamesHaveErrors) {
            let _text;
            if (this.state.dateHasErrors) {
                _text = 'Jūsu ievadītais datums nav pareizs. Lūdzu pārliecinieties par datuma pareizību.';
            } else {
                _text = 'Kāds no klašu nosaukumiem nav aizpildīts. Lūdzu pārliecinieties, ka visi klašu nosaukumi ir aizpildīti.';
            }
            _errors = <div className="alert alert-danger">
                {_text}
            </div>;
        } else if (this.state.saveError) {
            _errors = <div className="alert alert-warning">
                Saglabāšanas laikā radās kļūda. Lūdzu pārlādējiet lapu un mēģiniet vēlreiz.
            </div>;
        }

        const row_size = this.props.cozy ? 6 : 4;
        // columns is 1-indexed
        let full_rows = Math.floor(this.state.columns / row_size);

        let rows = [ ];
        for (let i = 0; i < full_rows; i++) {
            let row = [ ];
            for (let col = 1; col <= row_size; col++) {
                row.push(i * row_size + (col - 1));
            }
            rows.push(row);
        }
        let last_row = [ ];
        for (let col = full_rows * row_size; col <= this.state.columns - 1; col++) {
            last_row.push(col);
        }
        if (last_row.length > 0) {
            rows.push(last_row);
        }

        return <div>
            {_errors}
            <div className="row">
                <div className="col-md-3 form-inline">
                    <div className={'input-group' + (this.state.dateHasErrors ?
                                            ' has-error' : '')}>
                        <span className="input-group-addon">Datums: </span>
                        <input type="date" className="form-control"
                            placeholder="YYYY-MM-DD"
                            onChange={this._handleDateChange.bind(this)} />
                    </div>
                </div>
            </div>
            {rows.map((row, row_i) =>
                <div className="row" key={row_i}>
                    {row.map(col =>
                    <EntryColumn className={this.props.cozy ? 'col-md-2' : 'col-md-3'}
                        fixedHeight={this.props.fixedHeight}
                        ref={`column${col}`} key={col} />
                    )}
                    {row.length < row_size ?
                    <div className={this.props.cozy ? 'col-md-2' : 'col-md-3'}>
                        <button className="btn btn-default btn-lg btn-block"
                        onClick={this._addColumn.bind(this)}>
                            <span className="glyphicon glyphicon-plus" />
                        </button>
                    </div> : ''}
                </div>
            )}
            <div className="row" data-hack="row-last">
                {this.state.columns % row_size === 0 ?
                <div className={this.props.cozy ? 'col-md-2' : 'col-md-3'}>
                    <button className="btn btn-default btn-lg btn-block"
                        onClick={this._addColumn.bind(this)}>
                        <span className="glyphicon glyphicon-plus" />
                    </button>
                </div> : ''}
            </div>
            <p>
                <button className={'btn btn-primary' + (this.state.saving ? ' disabled' : '')}
                    onClick={this._handleSaveClicked.bind(this)}>
                    <span className="glyphicon glyphicon-floppy-disk" />
                    {' '}
                    Saglabāt
                </button>
            </p>
        </div>;
    }
}

let ChangeEntryPane = {
    init: (target) => {
        target.innerHTML = '';
        Promise.all([
            Settings.get('cozyMode'),
            Settings.get('fixedHeight')
        ])
        .then(([ cozyMode, fixedHeight ]) => {
            ReactDOM.render(
                <ChangeEntryPaneComponent
                    cozy={cozyMode} fixedHeight={fixedHeight} />,
                target
            );
        })
        .catch(err => {
            console.error(
                '[promise] Error while resolving Settings/rendering ChangeEntryPane',
                err);
        })
    }
}

export default ChangeEntryPane;
