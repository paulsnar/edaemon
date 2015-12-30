/*jshint -W097 */
'use strict';
/*jshint -W119 */ // I hate you, W119

var React = require('react');
var _ = require('lodash');
var Data = require('../data');
var history = require('../history');
var rp = require('../rp');
var LessonsColumn = require('../components/LessonsColumn');

var EditChangeHandler = React.createClass({
    componentDidMount: function() {
        rp.rpc.call('spinner.start');
        this.data = { change: null };
        Data.changes.get(this.props.params.id)
        .then(change => {
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.data.change = change.change;
            this.setState({ loaded: true, date: change.change.for_date,
                className: change.change.for_class });
        })
        .catch(err => {
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.setState({ loadingError: err });
        });
    },
    getInitialState: function() {
        return { loaded: false, loadingError: null,
                 saving: false, savingError: null,
                 inputError: null,
                 date: '', className: '' };
    },
    handleDateChange: function(e) {
        this.setState({ date: e.target.value.trim() });
    },
    handleClassnameChange: function(e) {
        this.setState({ className: e.target.value.trim() });
    },
    save: function() {
        if (this.state.date === '') {
            this.setState({ inputError: 'date' });
            return false;
        } else if (this.state.className === '') {
            this.setState({ inputError: 'className' });
            return false;
        }
        var lessons = this.refs.lessons.serialize();

        this.setState({ saving: true, inputError: null });

        Data.changes.edit(this.props.params.id,
            { date: this.state.date, className: this.state.className,
                lessons: lessons })
        .then(result => {
            if (!this.isMounted()) return;
            if (result.success) {
                history.push(`/changes/${result.change.id}`);
            } else {
                this.setState({ saving: false, savingError: true,
                    errorText: result.message });
            }
        })
        .catch(err => {
            if (!this.isMounted()) return;
            this.setState({ saving: false, savingError: true });
        });
    },
    render: function() {
        /*jshint ignore:start */
        if (!this.state.loaded) {
            return <div>
                <h1><span className="glyphicon glyphicon-pencil" /> Rediģēt izmaiņas</h1>
                <p><span className="glyphicon glyphicon-cog _spin" /> Notiek ielāde...</p>
            </div>;
        } else if (this.state.loadingError) {
            return <div>
                <h1><span className="glyphicon glyphicon-pencil" /> Rediģēt izmaiņas</h1>
                <div className="alert alert-danger">
                    <strong>Ak vai!</strong>&nbsp;
                    Mēģinot ielādēt informāciju, radās kļūda.&nbsp;
                    <code>{'' + this.state.loadingError}</code>
                </div>
            </div>;
        } else {
            var _error;
            if (this.state.savingError) {
                _error = <div className="alert alert-danger">
                    <strong>Ak vai!</strong>
                    &nbsp;
                    Mēģinot saglabāt, radās kļūda.
                </div>;
            } else if (this.state.error) {
                var _text;
                if (this.state.inputError === 'date') {
                    _text = 'Lūdzu pārliecinieties, ka datums ir ievadīts pareizi.';
                } else if (this.state.inputError === 'className') {
                    _text = 'Lūdzu pārliecinieties, ka klases nosaukums ir ievadīts pareizi.';
                }
                _error = <div className="alert alert-danger">
                    <span className="glyphicon glyphicon-hand-right" />
                    &nbsp;
                    {_text}
                </div>;
            }
            return <div>
                <h1><span className="glyphicon glyphicon-pencil" /> Rediģēt izmaiņas</h1>
                {_error}
                <div className="row">
                    <div className="col-md-3 form-inline">
                        <div className={`form-group ${this.state.error === 'date' ? 'has-error' : ''}`}>
                            <label>Datums: </label>
                            &nbsp;
                            <input type="date" className="form-control"
                                placeholder="YYYY-MM-DD"
                                onChange={this.handleDateChange}
                                value={this.state.date} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3" style={{ padding: '0.5rem' }}>
                        <div className={`input-group ${this.state.inputError === 'className' ? 'has-error' : ''}`}>
                            <span className="input-group-addon">Klase</span>
                            <input type="text" className="form-control" value={this.state.className}
                                onChange={this.handleClassnameChange} />
                        </div>
                        <LessonsColumn lessons={this.data.change.lessons} ref="lessons" />
                    </div>
                </div>
                <button className={`btn btn-primary ${this.state.saving ? 'disabled' : ''}`}
                    onClick={this.save}>
                    <span className={`glyphicon ${this.state.saving ? 'glyphicon-cog _spin' : 'glyphicon-floppy-disk'}`} />
                    &nbsp;
                    {this.state.saving ? 'Notiek saglabāšana…' : 'Saglabāt'}
                </button>
            </div>;
        }
        /*jshint ignore:end */
    }
});

module.exports = EditChangeHandler;
