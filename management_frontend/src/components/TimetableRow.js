/*jshint -W097 */
'use strict';

var React = require('react');
var _ = require('lodash');
var l10n = require('../l10n');
var LessonsColumn = require('../components/LessonsColumn');

var TimetableRow = React.createClass({
    getInitialState: function() {
        return { inputError: null };
    },
    serialize: function() {
        var className = this.refs.className.value.trim();
        if (className === '') {
            this.setState({ inputError: 'className' });
            return null;
        }
        var plan = { };
        var _days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        for (var i = 0; i < 5; i++) {
            plan[_days[i]] = this.refs[i].serialize();
        }
        this.setState({ inputError: null });
        return { className: className, lessons: plan };
    },
    render: function() {
        /*jshint ignore:start */
        return <div style={{ padding: '1rem' }}>
            <div className="row">
                <div className={`col-md-3 form-group form-inline ${this.state.inputError === 'className' ? 'has-error' : ''}`}
                style={{ padding: '1rem' }}>
                    <label>Klase:</label>
                    &nbsp;
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
        </div>;
    }
});

module.exports = TimetableRow;
