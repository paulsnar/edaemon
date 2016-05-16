'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import API from './api';
import Settings from './settings';

import { isValidISO8601 } from './common';

import EntryColumn from './components/EntryColumn';

class ChangeEditPaneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.data = {
            id: props.item.id,
            for_date: props.item.for_date,
            for_class: props.item.for_class,
            lessons: props.item.lessons.slice()
        }
        if (props.fixedHeight) {
            if (this.data.lessons.length < 9) {
                while (this.data.lessons.length < 9) this.data.lessons.push('');
            }
        } else {
            // add place for +th entry
            this.data.lessons.push('');
        }
        this.state = {
            date: this.data.for_date,
            dateHasErrors: false,
            classNameHasErrors: false,
            saving: false,
            saveError: false
        }
    }
    _handleDateChange(e) {
        this.data.for_date = e.target.value.trim();
        this.setState({ dateHasErrors: !isValidISO8601(this.data.for_date),
            date: e.target.value });
    }
    _handleSaveClicked() {
        if (this.state.saving) return;

        let dateIsValid = isValidISO8601(this.data.for_date);
        if (!dateIsValid) {
            if (!this.state.dateHasErrors) {
                this.setState({ dateHasErrors: true });
            }
            return;
        }

        if (!this.refs.entryColumn.validate()) {
            if (!this.state.classNameHasErrors) {
                this.setState({ classNameHasErrors: true });
            }
            return;
        } else {
            this.setState({ classNameHasErrors: false });
        }

        let data = this.refs.entryColumn.serialize();
        this.data.for_class = data.className;
        this.data.lessons = data.lessons;

        this.setState({ saving: true });
        API.Change.put(this.data.id, this.data)
        .then(success => {
            if (success) {
                window.setTimeout(() => {
                    this.setState({ saving: false });
                    window.location.assign(`/admin/changes/${this.data.id}`);
                }, 500);
            } else {
                this.setState({ saving: false, saveError: true });
            }
        });
    }
    render() {
        let _errors;
        if (this.state.dateHasErrors) {
            _errors = <div className="alert alert-danger">
                Jūsu ievadītais datums nav pareizs. Lūdzu pārliecinieties par datuma pareizību.
            </div>;
        } else if (this.state.classNameHasErrors) {
            _errors = <div className="alert alert-danger">
                Lūdzu ievadiet klases nosaukumu.
            </div>;
        } else if (this.state.saveError) {
            _errors = <div className="alert alert-warning">
                Saglabāšanas laikā radās kļūda. Lūdzu pārlādējiet lapu un mēģiniet vēlreiz.
            </div>
        }

        return <div>
            {_errors}
            <div className="row">
                <div className="col-md-3 form-inline">
                    <div className={'input-group' + (this.state.dateHasErrors ?
                        ' has-error' : '')}>
                        <span className="input-group-addon">Datums: </span>
                        <input type="date" className="form-control"
                            placeholder="YYYY-MM-DD" value={this.state.date}
                            onChange={this._handleDateChange.bind(this)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <EntryColumn className="col-md-3"
                    fixedHeight={this.props.fixedHeight}
                    data={{
                        className: this.data.for_class,
                        lessons: this.data.lessons
                    }}
                    ref="entryColumn" />
            </div>
            <p>
                <button className={'btn btn-primary' + (this.state.saving ? ' disabled' : '')}
                    onClick={this._handleSaveClicked.bind(this)}>
                    <span className="glyphicon glyphicon-floppy-disk"></span>
                    {' '}
                    Saglabāt
                </button>
            </p>
        </div>;
    }
}

let ChangeEditPane = {
    init: (target, data) => {
        target.innerHTML = '';
        Settings.get('fixedHeight')
        .then((fixedHeight) => {
            ReactDOM.render(
                <ChangeEditPaneComponent item={data}
                    fixedHeight={fixedHeight} />,
                target
            );
        });
    }
}

export default ChangeEditPane;
