/*jshint -W097 */
'use strict';

var React = require('react');
var Link = require('react-router').Link;

var Data = require('../data');
var ConfirmActionButton = require('./ConfirmActionButton');

var DefaultTimetable = React.createClass({
    handleDeleteClicked: function(callback) {
        Data.timetables.delete(this.props.timetable.id)
        /*jshint -W119 */
            .then(result => {
            /*jshint +W119 */
                if (result.success) {
                    if (this.props.removeCallback) {
                        this.props.removeCallback();
                    }
                }
            })
        /*jshint -W119 */
            .catch(() => {
            /*jshint +W119 */
                if (!this.isMounted()) return;
                callback(false);
            });
    },
    confirmActionButtonConfig: {
        icon: {
            standby: 'glyphicon-trash'
        }
    },
    render: function() {
        /*jshint ignore:start */
        return <span>
            <ConfirmActionButton
                className="btn btn-danger btn-xs"
                config={this.confirmActionButtonConfig}
                callback={this.handleDeleteClicked} />
            &nbsp;
            <Link className="btn btn-default btn-xs"
                to={`/timetables/${this.props.timetable.id}/edit`}>
                <span className="glyphicon glyphicon-pencil" />
            </Link>
            &nbsp;
            {this.props.timetable.for_class} klasei
        </span>;
        /*jshint ignore:end */
    }
});

module.exports = DefaultTimetable;
