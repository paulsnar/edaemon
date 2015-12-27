/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');
var Link = require('react-router').Link;

var Data = require('../data');
var ConfirmActionButton = require('./ConfirmActionButton');

var DefaultChange = React.createClass({
    handleDeleteClicked: function(callback) {
        Data.changes.delete(this.props.change.id)
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
                to={`/changes/${this.props.change.id}/edit`}>
                <span className="glyphicon glyphicon-pencil" />
            </Link>
            &nbsp;
            <Link to={`/changes/${this.props.change.id}`}>
                Datums: {this.props.change.for_date},&nbsp;
                klase: {this.props.change.for_class}
            </Link>
        </span>;
        /*jshint ignore:end */
    }
});

module.exports = DefaultChange;
