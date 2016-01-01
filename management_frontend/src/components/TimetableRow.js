/*jshint -W097 */
'use strict';

var React = require('react');
var _ = require('lodash');
var l10n = require('../l10n');
var LessonsColumn = require('../components/LessonsColumn');

var _days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

var TimetableRow = React.createClass({
    getInitialState: function() {
        if (this.props.timetable) {
            return { inputError: null,
                className: this.props.timetable.for_class,
                initialLessons: _.cloneDeep(this.props.timetable.plan) };
        } else {
            return { inputError: null, className: null, initialLessons: null };
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.timetable) {
            this.setState({
                className: nextProps.timetable.for_class,
                initialLessons: _.cloneDeep(nextProps.timetable.plan)
            });
        }
    },
    handleClassnameChange: function(e) {
        this.setState({ className: e.target.value.trim() });
    },
    serialize: function() {
        var className = this.state.className;
        if (_.isNull(className) || className === '') {
            this.setState({ inputError: 'className' });
            return null;
        }
        var plan = { };
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
                    <input type="text" className="form-control"
                        placeholder="0.z" value={this.state.className}
                        onChange={this.handleClassnameChange} />
                </div>
            </div>
            {_.times(5, i => {
                var _lessons;
                if (this.state.initialLessons) {
                    _lessons = <LessonsColumn ref={i}
                        lessons={this.state.initialLessons[_days[i]]} />;
                } else {
                    _lessons = <LessonsColumn ref={i} />;
                }
                return <div className="col-md-2" key={i}>
                    <strong>{_.capitalize(l10n.formatWeekday(i + 1, 'nominativs'))}</strong>
                    {_lessons}
                </div>;
            })}
        </div>;
        /*jshint ignore:end */
    }
});

module.exports = TimetableRow;
