'use strict';

var React = require('react');
var Link = require('react-router').Link;
var _ = require('lodash');
var Data = require('../data');
var l10n = require('../l10n');
var LessonsColumn = require('../components/LessonsColumn');
var SerializationError = require('../components/SerializationError');

var TimetableRow = React.createClass({
    getInitialState: function() {
        return { error: null };
    },
    serialize: function() {
        if (this.refs.className.value.trim() === '') {
            this.setState({ error: 'className' });
            return null;
        } else {
            var className = this.refs.className.value.trim();
        }
        var plan = { };
        _.times(5, (i) => {
            // return this.refs[i].serialize();
            var _days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            plan[_days[i]] = this.refs[i].serialize();
        });
        this.setState({ error: null });
        return { className: className, lessons: plan };
    },
    render: function() {
        return <div style={{ padding: '1rem' }}>
        <div className="row">
            <div className={`row form-group ${this.state.error === 'className' ? 'has-error' : ''}`}
                style={{ padding: '1rem' }}>
                <div className="col-md-1 col-sm-2 col-xs-3 text-right">
                    <label>Klase:</label>
                </div>
                <div className="col-md-2 col-sm-3 col-xs-3">
                    <input type="text" ref="className" className="form-control"
                        placeholder="0.z" />
                </div>
            </div>
            {_.times(5, i =>
                <div className="col-md-2" key={i}>
                    <strong>{_.capitalize(l10n.formatWeekday(i + 1, 'nominativs'))}</strong>
                    <LessonsColumn ref={i} />
                </div>
            )}
        </div>
        <hr />
        </div>;
    }
});

var NewTimetableHandler = React.createClass({
    addRow: function() {
        this.setState({ rows: this.state.rows + 1 });
    },
    getInitialState: function() {
        return { rows: 1, saving: false,
            savingError: false, saved: false };
    },
    save: function() {
        try {
            var entries = _.times(this.state.rows, (i) => {
                var serialized = this.refs[i].serialize();
                if (serialized === false) {
                    this.setState({ saving: false, error: 'className' });
                    throw new SerializationError();
                } else {
                    return serialized;
                }
            });
            Data.timetables.input({ timetables: entries })
            .then(result => {
                if (!this.isMounted()) return;
                if (result.success) {
                    this.setState({ saving: false, saved: true, items: result.stored });
                } else {
                    this.setState({ saving: false, savingError: true,
                        errorText: result.message || null });
                }
            })
            .catch(err => {
                if (!this.isMounted()) return;
                this.setState({ saving: false, savingError: true, errorText: err });
            });
        } catch (SerializationError) {
            return false;
        }
    },
    render: function() {
        if (this.state.saved) {
            return <div>
                <h1><span className="glyphicon glyphicon-ok" /> Ievadīt stundu sarakstu</h1>
                <div className="alert alert-success">
                    <strong>Darīts!</strong>&nbsp;
                    Saglabāšana noritēja veiksmīgi.
                </div>
            </div>;
        } else {
            var _error;
            if (this.state.savingError) {
                _error = <div className="alert alert-danger">
                    <strong>Ak vai!</strong>
                    &nbsp;
                    Saglabāšana neizdevās: {this.state.errorText}
                </div>;
            }
            return <div>
                <h1><span className="glyphicon glyphicon-plus" /> Ievadīt stundu sarakstu</h1>
                {_error}
                {_.times(this.state.rows, (i) =>
                <div className="row" key={i}>
                    <TimetableRow ref={i} />
                </div>
                )}
                <div className="row">
                    <button className="btn btn-default btn-lg btn-block"
                    onClick={this.addRow}>
                        <span className="glyphicon glyphicon-plus" />
                    </button>
                </div>
                <p style={{ padding: '0.5rem' }}>
                    <button className={`btn btn-primary ${this.state.saving ? 'disabled' : ''}`}
                    onClick={this.save}>
                        <span className={`glyphicon ${this.state.saving ? 'glyphicon-cog _spin' : 'glyphicon-floppy-disk'}`} />
                        &nbsp;
                        {this.state.saving ? 'Notiek saglabāšana…' : 'Saglabāt'}
                    </button>
                </p>
            </div>;
        }
    }
});

module.exports = NewTimetableHandler;
