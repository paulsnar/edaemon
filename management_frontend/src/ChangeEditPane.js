'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import API from './api';

import { isValidISO8601 } from './common';

class ChangeEditPaneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.data = {
            id: props.item.id,
            for_date: props.item.for_date,
            for_class: props.item.for_class,
            lessons: props.item.lessons.slice()
        }
        this.data.lessons.push('');
        this.state = {
            date: this.data.date,
            className: this.data.className,
            lessons: this.data.lessons.slice(),
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
    _handleClassnameChange(e) {
        this.data.for_class = e.target.value.trim();
        this.setState({ classNameHasErrors: this.data.for_class === '',
            className: e.target.value });
    }
    _handleLessonChange(lessonI, e) {
        this.data.lessons[lessonI] = e.target.value.trim();

        let lessons = this.state.lessons.slice();
        lessons[lessonI] = e.target.value;
        this.setState({ lessons });
    }
    _handleLessonFocus(lessonI, e) {
        if (lessonI === this.data.lessons.length - 1) {
            this.data.lessons.push('');
            // this.forceUpdate();
            let lessons = this.state.lessons.slice();
            lessons.push('');
            this.setState({ lessons });
        }
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

        if (this.data.for_class.trim() === '') {
            if (!this.state.classNameHasErrors) {
                this.setState({ classNameHasErrors: true });
            }
            return;
        }

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
                <div className="col-md-3">
                    <div className="input-group">
                        <span className="input-group-addon">Klase: </span>
                        <input type="text" className="form-control"
                            value={this.state.className}
                            onChange={this._handleClassnameChange.bind(this)} />
                    </div>
                    {this.state.lessons.map((item, i) =>
                    <div className="input-group">
                        <span className="input-group-addon">{i === this.data.lessons.length - 1 ? '+' : i}.</span>
                        <input type="text" className="form-control"
                            value={item}
                            onChange={this._handleLessonChange.bind(this, i)}
                            onFocus={this._handleLessonFocus.bind(this, i)} />
                    </div>
                    )}
                </div>
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
        ReactDOM.render(
            <ChangeEditPaneComponent item={data} />,
            target
        );
    }
}

export default ChangeEditPane;
