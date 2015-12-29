'use strict';

var React = require('react');
var _ = require('lodash');

var LessonsColumn = React.createClass({
    getInitialState: function() {
        if (this.props.lessons) {
            return { lessons: _.clone(this.props.lessons) };
        } else {
            return { lessons: [ '', '', '', '', '', '', '' ] };
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.lessons) {
            this.setState({ lessons: _.clone(nextProps.lessons) });
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
        var lessons = this.state.lessons.map(lesson => {
            if (lesson === '' || lesson === '-') return null;
            else return lesson;
        });
        var lesson = lessons[lessons.length - 1];
        // remove empty lessons from the end
        while (_.isNull(lesson)) {
            lesson = lessons.pop();
        }
        if (!_.isNull(lesson)) lessons.push(lesson);
        return lessons;
    },
    render: function() {
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
    }
});

module.exports = LessonsColumn;
