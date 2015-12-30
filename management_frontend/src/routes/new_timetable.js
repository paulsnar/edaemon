/*jshint -W097 */
'use strict';

var React = require('react');
var Link = require('react-router').Link;
var _ = require('lodash');
var Data = require('../data');
var l10n = require('../l10n');

var TimetableRow = require('../components/TimetableRow');

var NewTimetableHandler = React.createClass({
    addRow: function() {
        this.setState({ rows: this.state.rows + 1 });
    },
    getInitialState: function() {
        return { rows: 1, saving: false,
            savingError: false, saved: false };
    },
    save: function() {
        var entries = [ ];
        for (var i = 0; i < this.state.rows; i++) {
            var serialized = this.refs[i].serialize();
            if (serialized === null) {
                this.setState({ saving: false, error: 'className' });
                return false;
            } else {
                entries.push(serialized);
            }
        }
        Data.timetables.input({ timetables: entries })
        /*jshint -W119 */
        .then(result => {
        /*jshint +W119 */
            if (!this.isMounted()) return;
            if (result.success) {
                this.setState({ saving: false, saved: true, items: result.stored });
            } else {
                this.setState({ saving: false, savingError: true,
                    errorText: result.message || null });
            }
        })
        /*jshint -W119 */
        .catch(err => {
        /*jshint +W119 */
            if (!this.isMounted()) return;
            this.setState({ saving: false, savingError: true, errorText: err });
        });
    },
    render: function() {
        /*jshint ignore:start */
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
        /*jshint ignore:end */
    }
});

module.exports = NewTimetableHandler;
