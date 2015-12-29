/*jshint -W097 */
'use strict';

var React = require('react');
var _ = require('lodash');

var ChangeColumn = React.createClass({
    getInitialState: function() {
        if (this.props.changeData) {
            return {
                className: this.props.changeData.for_class,
                lessons: this.props.changeData.lessons
            };
        } else {
            return {
                className: '',
                lessons: [ '', '', '', '', '', '' ]
            };
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.changeData) {
            this.setState({
                className: nextProps.changeData.for_class,
                lessons: nextProps.changeData.lessons,
            });
        }
    },
    addRow: function() {
        var lessons = this.state.lessons;
        lessons.push('');
        this.setState({ lessons: lessons });
    },
    createHandleChange: function(name, index) {
        /*jshint -W119 */
        return (e) => {
        /*jshint +W119 */
            if (!this.isMounted()) return;
            if (name === 'className') {
                this.setState({ className: e.target.value });
            } else if (name === 'lesson') {
                var lessons = this.state.lessons;
                lessons[index] = e.target.value;
                this.setState({ lessons: lessons });
            }
        };
    },
    serialize: function() {
        if (this.state.className.trim() === '') {
            this.setState({ error: 'className' });
            return false;
        }
        var s = _.cloneDeep(this.state);
        /*jshint -W119 */
        s.lessons = _.map(s.lessons, lesson => {
        /*jshint +W119 */
            if (lesson === '' || lesson === '-') {
                return null;
            } else {
                return lesson;
            }
        });
        this.setState({ error: null });
        return s;
    },
    render: function() {
        /*jshint ignore:start */
        return <div>
            <div className={`input-group ${this.state.error === 'className' ? 'has-error' : ''}`}>
                <span className="input-group-addon">Klase</span>
                <input type="text" className="form-control"
                    value={this.state.className}
                    onChange={this.createHandleChange('className')} />
            </div>
            {this.state.lessons.map((text, i) =>
            <div className="input-group" key={i}>
                <span className="input-group-addon">{i}.</span>
                <input type="text" className="form-control"
                    value={text}
                    onChange={this.createHandleChange('lesson', i)} />
            </div>
            )}
            <button className="btn btn-default btn-block" onClick={this.addRow}>
                <span className="glyphicon glyphicon-plus" />
            </button>
        </div>;
        /*jshint ignore:end */
    }
});

module.exports = ChangeColumn;
