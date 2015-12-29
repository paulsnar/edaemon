'use strict';

var React = require('react');
var _ = require('lodash');
var Data = require('../data');
var history = require('../history');
var rp = require('../rp');
var ChangeColumn = require('../components/ChangeColumn');

var EditChangeHandler = React.createClass({
    componentDidMount: function() {
        rp.rpc.call('spinner.start');
        this.data = { change: null };
        Data.changes.get(this.props.params.id)
        .then(change => {
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.data.change = change.change;
            this.setState({ loaded: true, date: change.change.for_date });
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
                 error: null,
                 date: '' };
    },
    handleDateChange: function(e) {
        this.setState({ date: e.target.value });
    },
    save: function() {
        if (this.state.date === '') {
            this.setState({ error: 'date' });
            return false;
        }
        var serializedChange = this.refs.change.serialize();
        if (serializedChange === false) {
            this.setState({ error: 'className' });
            return false;
        }
        this.setState({ saving: true, error: null });
        Data.changes.edit(this.props.params.id,
            { date: this.state.date, className: serializedChange.className,
                lessons: serializedChange.lessons })
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
                    <strong>Ak vai!</strong>&nbsp;
                    Mēģinot saglabāt, radās kļūda.&nbsp;
                </div>;
            } else if (this.state.error) {
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
                <h1><span className="glyphicon glyphicon-pencil" /> Rediģēt izmaiņas</h1>
                {_error}
                <div className="row">
                    <div className="col-md-3 form-inline">
                        <div className={`form-group ${this.state.error === 'date' ? 'has-error' : ''}`}>
                            <label htmlFor="date">Datums: </label>
                            &nbsp;
                            <input type="date" className="form-control"
                                id="date" name="date" placeholder="YYYY-MM-DD"
                                onChange={this.handleDateChange}
                                value={this.state.date} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3" style={{ padding: '0.5rem' }}>
                        <ChangeColumn changeData={this.data.change} ref="change" />
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
    }
});

module.exports = EditChangeHandler;
