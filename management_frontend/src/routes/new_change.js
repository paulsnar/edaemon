/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');
var Link = require('react-router').Link;
var _ = require('lodash');
var Data = require('../data');

var ChangeColumn = require('../components/ChangeColumn');

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
            /*jshint -W119 */
            var changes = _.times(this.state.columns, (i) => {
            /*jshint +W119 */
                var serialized = this.refs[i].serialize();
                if (serialized === false) {
                    this.setState({ saving: false, error: 'className' });
                    throw new Error();
                } else {
                    return serialized;
                }
            });
            Data.changes.input({ date: this.state.date, changes: changes })
            /*jshint -W119 */
            .then(result => {
            /*jshint +W119 */
                if (!this.isMounted()) return;
                if (result.success) {
                    // show stuff
                    this.setState({ saving: false, saved: true, items: result.stored });
                } else {
                    this.setState({ saving: false, savingError: true, errorText: result.message || false });
                }
            })
            .catch(err => {
                if (!this.isMounted()) return;
                this.setState({ saving: false, savingError: true });
            });
        } catch (Error) {
            return false;
        }
    },
    render: function() {
        if (this.state.saved === false) {
            var _error = '';
            if (this.state.savingError) {
                var _innerText = '';
                if (this.state.errorText) {
                    /*jshint ignore:start */
                    _innerText = <span>
                        Serveris atbildēja:&nbsp;
                        <pre>{this.state.errorText}</pre>
                    </span>;
                    /*jshint ignore:end */
                }
                /*jshint ignore:start */
                _error = <div className="alert alert-danger alert-dismissible">
                    <button className="close">&times;</button>
                    <strong>Ak vai!</strong>&nbsp;
                    Saglabājot radās kļūda.&nbsp;
                    {_innerText}
                </div>;
                /*jshint ignore:end */
            } else if (this.state.error) {
                if (this.state.error === 'date') {
                    /*jshint ignore:start */
                    _error = <div className="alert alert-danger">
                        Lūdzu ievadiet datumu.
                    </div>;
                    /*jshint ignore:end */
                } else if (this.state.error === 'className') {
                    /*jshint ignore:start */
                    _error = <div className="alert alert-danger">
                        Lūdzu pārliecinieties, ka visas klases ir aizpildītas pareizi.
                    </div>;
                    /*jshint ignore:end */
                }
            }
            /*jshint ignore:start */
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
                        <ChangeColumn ref={i} />
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
            /*jshint ignore:end */
        } else {
            /*jshint ignore:start */
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
            /*jshint ignore:end */
        }
    }
});

// export { NewChangeHandler };
module.exports = { NewChangeHandler: NewChangeHandler };
