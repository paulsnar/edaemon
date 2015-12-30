/*jshint -W097 */
'use strict';

var React = require('react');
var _ = require('lodash');
var Data = require('../data');
var rp = require('../rp');

var TimetableRow = require('../components/TimetableRow');

var EditTimetableHandler = React.createClass({
    componentDidMount: function() {
        rp.rpc.call('spinner.start');
        this.data = { timetable: null };
        Data.timetables.get(this.props.params.id)
        .then(resp => {
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.data.timetable = resp.timetable;
            this.setState({ loaded: true });
        })
        .catch(err => {
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.setState({ loadingError: err });
        })
    },
    getInitialState: function() {
        return { loaded: false, loadingError: null,
                 saving: false, savingError: null, saved: false,
                 inputError: null };
    },
    save: function() {
        var timetable = this.refs.timetable.serialize();
        if (_.isNull(timetable)) {
            this.setState({ inputError: 'className' });
            return false;
        }

        this.setState({ saving: true, inputError: null });

        Data.timetables.edit(this.props.params.id, timetable)
        .then(result => {
            if (!this.isMounted()) return;
            if (result.success) {
                this.setState({ saving: false, saved: true });
            } else {
                this.setState({ saving: false, savingError: result.message });
            }
        })
        .catch(err => {
            if (!this.isMounted()) return;
            this.setState({ saving: false, savingError: '' + err });
        });
    },
    render: function() {
        /*jshint ignore:start */
        if (!this.state.loaded) {
            return <div>
                <h1><span className="glyphicon glyphicon-pencil" /> Rediģēt stundu sarakstu</h1>
                <p><span className="glyphicon glyphicon-cog _spin" /> Notiek ielāde…</p>
            </div>;
        } else if (this.state.loadingError) {
            return <div>
                <h1><span className="glyphicon glyphicon-pencil" /> Rediģēt stundu sarakstu</h1>
                <div className="alert alert-danger">
                    <strong>Ak vai!</strong>
                    &nbsp;
                    Mēģinot ielādēt informāciju, radās kļūda.
                    &nbsp;
                    <code>{this.state.loadingError}</code>
                </div>
            </div>;
        } else if (this.state.saved) {
            return <div>
                <h1><span className="glyphicon glyphicon-ok" /> Rediģēt stundu sarakstu</h1>
                <div className="alert alert-success">
                    <strong>Darīts!</strong>
                    &nbsp;
                    Saglabāšana noritēja veiksmīgi.
                </div>
            </div>;
        } else {
            var _error;
            if (this.state.savingError) {
                _error = <div className="alert alert-danger">
                    <strong>Ak vai!</strong>
                    &nbsp;
                    Mēģinot saglabāt, radās kļūda.
                    &nbsp;
                    <code>{this.state.savingError}</code>
                </div>;
            } else if (this.state.inputError) {
                _error = <div className="alert alert-danger">
                    <span className="glyphicon glyphicon-hand-right" />
                    &nbsp;
                    Lūdzu pārliecinieties, ka klases nosaukums ir ievadīts pareizi.
                </div>;
            }
            return <div>
                <h1><span className="glyphicon glyphicon-pencil" /> Rediģēt izmaiņas</h1>
                {_error}
                <div className="row">
                    <TimetableRow timetable={this.data.timetable} ref="timetable" />
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

module.exports = EditTimetableHandler;
