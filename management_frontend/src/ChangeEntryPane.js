'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import API from './api';
import Settings from './settings';

import { isValidISO8601 } from './common';

class ChangeEntryPaneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.data = {
            date: '',
            items: [
                [ /* each row */
                    { className: '', lessons: ['', '', '', '', '', '', ''] }
                ]
            ]
        }
        if (props.fixedHeight) {
            this.data.items[0][0].lessons = ['', '', '', '', '', '', '', '', ''];
        }
        this.state = {
            dateHasErrors: false,
            classNamesWithErrors: [ ],
            saving: false,
            saveError: false
        }
    }
    _handleDateChange(e) {
        this.data.date = e.target.value;
        this.setState({ dateHasErrors: !isValidISO8601(this.data.date) });
    }
    _handleClassnameChange(rowI, classI, e) {
        this.data.items[rowI][classI].className = e.target.value;
        // this.forceUpdate();
    }
    _handleLessonChange(rowI, classI, lessonI, e) {
        this.data.items[rowI][classI].lessons[lessonI] = e.target.value;
        // this.forceUpdate();
    }
    _handleLessonFocus(rowI, classI, lessonI, e) {
        if (this.props.fixedHeight) return;
        if (lessonI === this.data.items[rowI][classI].lessons.length - 1) {
            this.data.items[rowI][classI].lessons.push('');
            this.forceUpdate();
        }
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

        let foundError = false;

        // flatten this.data.items
        let items = [ ];
        this.data.items.forEach((row, rowI) => {
            // also perform validation
            row.forEach((item, itemI) => {
                let empty = true;
                item.lessons.forEach(l => { if (l !== '') empty = false });
                if (item.className === '' && !empty) {
                    let classNamesWithErrors =
                        this.state.classNamesWithErrors.slice();
                    classNamesWithErrors.push(rowI * 4 + itemI);
                    this.setState({ classNamesWithErrors });
                    foundError = true;
                } else if (!empty) {
                    items.push({
                        for_class: item.className,
                        lessons: item.lessons
                    });
                }
            });
            // items = items.concat(row);
        });
        if (foundError) return; // check after above

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
        if ((!this.props.cozy && this.data.items[this.data.items.length - 1].length === 4) ||
            (this.props.cozy && this.data.items[this.data.items.length - 1].length === 6)) {
            this.data.items.push(
                [
                    { className: '', lessons:
                        this.props.fixedHeight ?
                            ['', '', '', '', '', '', '', '', ''] :
                            ['', '', '', '', '', '', ''] }
                ]
            );
        } else {
            this.data.items[this.data.items.length - 1].push(
                { className: '', lessons:
                    this.props.fixedHeight ?
                        ['', '', '', '', '', '', '', '', ''] :
                        ['', '', '', '', '', '', '' ] })
        }
        this.forceUpdate();
    }
    render() {
        let _errors;
        if (this.state.dateHasErrors ||
            this.state.classNamesWithErrors.length > 0) {
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
            {this.data.items.map((row, rowI) =>
            <div className="row">
                {row.map((_class, classI) =>
                <div className={this.props.cozy ? 'col-md-2' : 'col-md-3'}>
                    <div className="input-group">
                        <span className="input-group-addon">Klase: </span>
                        <input type="text" className="form-control"
                            onChange={this._handleClassnameChange.bind(this, rowI, classI)} />
                    </div>
                    {_class.lessons.map((item, i) =>
                    <div className="input-group">
                        <span className="input-group-addon">
                            {(!this.props.fixedHeight && i === _class.lessons.length - 1) ? '+' : i}.
                        </span>
                        <input type="text" className="form-control"
                            onChange={this._handleLessonChange.bind(this, rowI, classI, i)}
                            onFocus={this._handleLessonFocus.bind(this, rowI, classI, i)} />
                    </div>
                    )}
                </div>
                )}
                {((!this.props.cozy && row.length < 4) || (this.props.cozy && row.length < 6)) ?
                <div className={this.props.cozy ? 'col-md-2' : 'col-md-3'}>
                    <button className="btn btn-default btn-lg btn-block"
                        onClick={this._addColumn.bind(this)}>
                        <span className="glyphicon glyphicon-plus" />
                    </button>
                </div> : ''}
            </div>
            )}
            <div className="row" data-hack="row-last">
                {((!this.props.cozy && this.data.items[this.data.items.length - 1].length === 4) ||
                  (this.props.cozy && this.data.items[this.data.items.length - 1].length === 6))?
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
        });
    }
}

export default ChangeEntryPane;
