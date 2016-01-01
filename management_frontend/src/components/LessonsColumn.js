/*jshint -W097 */
'use strict';

var React = require('react');
var _ = require('lodash');

var LessonsColumn = React.createClass({
    getInitialState: function() {
        if (this.props.lessons) {
            return { lessons: _.clone(this.props.lessons).concat([ '' ]) };
        } else {
            return { lessons: [ '', '', '', '', '', '', '' ] };
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.lessons) {
            this.setState({ lessons: _.clone(nextProps.lessons).concat([ '' ]) });
        }
    },
    addRow: function() {
        // this.state.lessons.push('');
        var lessons = this.state.lessons;
        lessons.push('');
        this.setState({ lessons: lessons });
    },
    handleFocus: function(index, e) {
        if (index === (this.state.lessons.length - 1)) {
            this.addRow();
        }
    },
    handleChange: function(index, e) {
        var lessons = this.state.lessons;
        lessons[index] = e.target.value.trim();
        this.setState({ lessons: lessons });
    },
    serialize: function() {
        /*jshint -W119*/
        var lessons = this.state.lessons.map(lesson => {
            /*jshint +W119*/
            if (lesson === '' || lesson === '-') return null;
            else return lesson;
        });
        // remove empty lessons from the end
        var lesson = lessons[lessons.length - 1];
        if (_.isNull(lesson)) {
            while (_.isNull(lesson)) {
                lesson = lessons.pop();
            }
            if (!_.isNull(lesson)) lessons.push(lesson);
        }
        return lessons;
    },
    render: function() {
        /*jshint ignore:start */
        return <div>
        {this.state.lessons.map((text, i) =>
        <div className="input-group" key={i}>
            <span className="input-group-addon">
                {i === (this.state.lessons.length - 1) ? '+.' : `${i}.`}
            </span>
            <input type="text" className="form-control" value={text}
                onFocus={this.handleFocus.bind(this, i)}
                onChange={this.handleChange.bind(this, i)} />
        </div>
        )}
        </div>;
        /*jshint ignore:end */
    }
});

module.exports = LessonsColumn;
