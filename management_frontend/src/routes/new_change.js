/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');
var Link = require('react-router').Link;
var _ = require('lodash');
var Data = require('../data');
var LessonsColumn = require('../components/LessonsColumn');

var NewChangeHandler = React.createClass({
    addColumn: function() {
        var classNames = _.clone(this.state.classNames);
        classNames.push('');
        this.setState({ classNames: classNames });
    },
    getInitialState: function() {
        return {
            classNames: [''],
            badClassnames: [ ], // used in case of error
            date: '',
            saving: false, savingError: false, saved: false
        };
    },
    handleDateChange: function(e) {
        this.setState({ date: e.target.value });
    },
    save: function() {
        var classNames = _.clone(this.state.classNames);
        var hasEmptyClassnames = _.some(classNames, v => v === '');
        if (hasEmptyClassnames) {
            var badClassnames = [ ];
            _.forEach(classNames, (className, i) => {
                if (className === '') badClassnames.push(i);
            });
            this.setState({ inputError: 'className',
                badClassnames: badClassnames });
            return false;
        }
        if (this.state.date === '') {
            this.setState({ inputError: 'date' });
            return false;
        }
        this.setState({ saving: true });
        var changes = _.map(classNames, (className, i) => {
            var serialized = this.refs[i].serialize();
            return { className: className, lessons: serialized };
        });

        Data.changes.input({ date: this.state.date, changes: changes })
        .then(result => {
            if (!this.isMounted()) return;
            if (result.success) {
                this.setState({ saving: false, saved: true, items: result.stored });
            } else {
                this.setState({ saving: false, savingError: true,
                    errorText: result.message || 'neko' /* (nothing) */ });
            }
        })
        .catch(err => {
            if (!this.isMounted()) return;
            this.setState({ saving: false, savingError: true,
                errorText: '' + err });
        });
    },
    handleClassnameChange: function(index, e) {
        var classNames = _.clone(this.state.classNames);
        classNames[index] = e.target.value.trim();
        this.setState({ classNames: classNames });
    },
    render: function() {
        if (this.state.saved) {
            return <div>
                <h1><span className="glyphicon glyphicon-ok" /> Ievadīt jaunas izmaiņas</h1>
                <div className="alert alert-success">
                    <strong>Darīts!</strong>
                    &nbsp;
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
        } else {
            var _error, _columns;
            if (this.state.savingError) {
                _error = <div className="alert alert-danger">
                    <strong>Ak vai!</strong>
                    &nbsp;
                    Saglabāšana neizdevās: {this.state.errorText}
                </div>;
            } else if (this.state.inputError) {
                var _text;
                if (this.state.inputError === 'date') {
                    _text = 'Lūdzu pārliecinieties, ka datums ir ievadīts pareizi.';
                } else if (this.state.inputError === 'className') {
                    _text = 'Lūdzu pārliecinieties, ka visi klašu nosaukumi ir ievadīti pareizi.';
                }
                _error = <div className="alert alert-danger">
                    <span className="glyphicon glyphicon-hand-right" />
                    &nbsp;
                    {_text}
                </div>;
            }

            _columns = this.state.classNames.map((className, i) =>
            <div key={i} className="col-md-2">
                <div className={`input-group ${_.includes(this.state.badClassnames, i) ? 'has-error' : ''}`}>
                    <span className="input-group-addon">Klase</span>
                    <input type="text" className="form-control" value={className}
                        onChange={this.handleClassnameChange.bind(this, i)} />
                </div>
                <LessonsColumn ref={i} />
            </div>
            );

            return <div>
                <h1><span className="glyphicon glyphicon-plus" /> Ievadīt jaunas izmaiņas</h1>
                {_error}
                <div className="row">
                    <div className="col-md-3 form-inline">
                        <div className={`form-group ${this.state.inputError === 'date' ? 'has-error' : ''}`}>
                            <label>Datums:</label>
                            &nbsp;
                            <input type="date" className="form-control"
                            placeholder="YYYY-MM-DD"
                            onChange={this.handleDateChange}
                            value={this.state.date} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    {_columns}
                    <div className="col-md-2">
                        <button className="btn btn-default btn-lg btn-block"
                        onClick={this.addColumn}>
                            <span className="glyphicon glyphicon-plus" />
                        </button>
                    </div>
                </div>
                <p>
                    <button className={`btn btn-primary ${this.state.saving ? 'disabled' : ''}`}
                        onClick={this.save}>
                        <span className={`glyphicon ${this.state.saving ? 'glyphicon-cog _spin' : 'glyphicon-floppy-dist'}`} />
                        &nbsp;
                        {this.state.saving ? 'Notiek saglabāšana…' : 'Saglabāt'}
                    </button>
                </p>
            </div>;
        }
    }
});

module.exports = { NewChangeHandler: NewChangeHandler };
