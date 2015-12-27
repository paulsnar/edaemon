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

var Column = React.createClass({
    getInitialState: function() {
        return {
            className: '',
            lessons: [ '', '', '', '', '', '' ]
        };
    },
    addRow: function() {
        var lessons = this.state.lessons;
        lessons.push('');
        this.setState({ lessons });
    },
    createHandleChange: function(name, index) {
        return (e) => {
            if (!this.isMounted()) return;
            if (name === 'className') {
                this.setState({ className: e.target.value });
            } else if (name === 'lesson') {
                var lessons = this.state.lessons;
                lessons[index] = e.target.value;
                this.setState({ lessons: lessons });
            }
        };
    },
    serialize: function() {
        if (this.state.className.trim() === '') {
            this.setState({ error: 'className' });
            return false;
        }
        var s = _.cloneDeep(this.state);
        s.lessons = _.map(s.lessons, lesson => {
            if (lesson === '' || lesson === '-') {
                return null;
            } else {
                return lesson;
            }
        });
        this.setState({ error: null });
        return s;
    },
    render: function() {
        return <div>
            <div className={`input-group ${this.state.error === 'className' ? 'has-error' : ''}`}>
                <span className="input-group-addon">Klase</span>
                <input type="text" className="form-control"
                    onChange={this.createHandleChange('className')} />
            </div>
            {this.state.lessons.map((text, i) =>
            <div className="input-group" key={i}>
                <span className="input-group-addon">{i}.</span>
                <input type="text" className="form-control"
                    onChange={this.createHandleChange('lesson', i)} />
            </div>
            )}
            <button className="btn btn-default btn-block" onClick={this.addRow}>
                <span className="glyphicon glyphicon-plus" />
            </button>
        </div>;
    }
});

var NewChangeHandler = React.createClass({
    addColumn: function() {
        this.setState({ columns: this.state.columns + 1 });
    },
    getInitialState: function() {
        return { columns: 1, saving: false,
            savingError: false, saved: false, date: '' };
    },
    handleDateChange: function(e) {
        this.setState({ date: e.target.value });
    },
    doSave: function() {
        try {
            this.setState({ saving: true, error: null });
            if (this.state.date === '') {
                this.setState({ saving: false, error: 'date' });
                return false;
            }
            var changes = _.times(this.state.columns, (i) => {
                var serialized = this.refs[i].serialize();
                if (serialized === false) {
                    this.setState({ saving: false, error: 'className' });
                    throw new Error();
                } else {
                    return serialized;
                }
            });
            Data.changes.input({ date: this.state.date, changes })
                .then(result => {
                    if (!this.isMounted()) return;
                    if (result.success) {
                        // show stuff
                        this.setState({ saving: false, saved: true, items: result.stored });
                    } else {
                        this.setState({ saving: false, savingError: true, errorText: result.message || false });
                    }
                });
        } catch (Error) {
            return false;
        }
    },
    render() {
        if (this.state.saved === false) {
            var _error = '';
            if (this.state.savingError) {
                var _innerText = '';
                if (this.state.errorText) {
                    _innerText = <span>
                        Serveris atbildēja:&nbsp;
                        <pre>{this.state.errorText}</pre>
                    </span>;
                }
                _error = <div className="alert alert-danger alert-dismissible">
                    <button className="close">&times;</button>
                    <strong>Ak vai!</strong>&nbsp;
                    Saglabājot radās kļūda.&nbsp;
                    {_innerText}
                </div>;
            }
            if (this.state.error) {
                if (this.state.error === 'date') {
                    _error = <div className="alert alert-danger">
                        Lūdzu ievadiet datumu.
                    </div>;
                } else if (this.state.error === 'className') {
                    _error = <div className="alert alert-danger">
                        Lūdzu pārliecinieties, ka visas klases ir aizpildītas pareizi.
                    </div>;
                }
            }
            return <div>
                <h1><span className="glyphicon glyphicon-plus" /> Ievadīt jaunas izmaiņas</h1>
                {_error}
                <div className="row">
                    <div className="col-md-3 form-inline">
                        <div className={`form-group ${this.state.error === 'date' ? 'has-error' : ''}`}>
                            <label htmlFor="date">Datums: </label>
                            &nbsp;<input
                                type="date"
                                className="form-control"
                                id="date"
                                name="date"
                                placeholder="YYYY-MM-DD"
                                onChange={this.handleDateChange} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    {_.times(this.state.columns, (i) =>
                    <div className="col-md-2" key={i} style={{ padding: '0.5rem' }}>
                        <Column ref={i} />
                    </div>
                    )}
                    <div className="col-md-2">
                        <button className="btn btn-default btn-lg btn-block" onClick={this.addColumn}>
                            <span className="glyphicon glyphicon-plus" />
                        </button>
                    </div>
                </div>
                <button className={`btn btn-primary ${this.state.saving? 'disabled':''}`} onClick={this.doSave}>
                    <span className={`glyphicon ${this.state.saving ? 'glyphicon-cog _spin' : 'glyphicon-floppy-disk'}`} />&nbsp;
                    {this.state.saving ? 'Notiek saglabāšana…' : 'Saglabāt'}
                </button>
            </div>;
        } else {
            return <div>
                <h1><span className="glyphicon glyphicon-plus" /> Ievadīt jaunas izmaiņas</h1>
                <div className="alert alert-success">
                    <strong>Darīts!</strong>&nbsp;
                    Saglabāšana noritēja veiksmīgi.
                </div>
                <ul>
                    {_.map(this.state.items, (id, className) =>
                    <li key={id}>
                        <Link to={`/changes/${id}`}>{className} klasei</Link>
                    </li>
                    )}
                </ul>
            </div>;
        }
    }
});

// export { NewChangeHandler };
module.exports = { NewChangeHandler: NewChangeHandler };
