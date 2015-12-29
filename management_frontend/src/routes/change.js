/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');
var Link = require('react-router').Link;

var formatDate = require('../l10n').formatDate;
var rp = require('../rp');
var Data = require('../data');
var history = require('../history');
var ConfirmActionButton = require('../components/ConfirmActionButton');

var ChangeHandler = React.createClass({
    componentDidMount: function() {
        rp.rpc.call('spinner.start');
        this.data = { };
        /*jshint -W119 */
        Data.changes.get(this.props.params.id).then(change => {
        /*jshint +W119 */
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.data.change = change.change;
            this.setState({ loaded: true });
        /*jshint -W119 */
        }).catch(err => {
        /*jshint +W119 */
            rp.rpc.call('spinner.stop');
            console.log(err);
            if (!this.isMounted()) return;
            this.setState({ error: err });
        });
    },
    getInitialState: function() {
        return { loaded: false };
    },

    deleteActionButtonConfig: {
        text: {
            standby: 'Dzēst'
        },
        icon: {
            standby: 'glyphicon-trash'
        }
    },
    handleDeleteClicked: function(callback) {
        Data.changes.delete(this.props.params.id)
        .then(result => {
            if (result.success) {
                history.push('/');
            }
        })
        .catch(err => {
            if (!this.isMounted()) return;
            callback(false);
        });
    },
    render: function() {
        if (this.state.loaded) {
            /*jshint ignore:start */
            return <div>
                <h1>Izmaiņas {this.data.change.for_class} klasei</h1>
                <p>
                    <ConfirmActionButton
                        className="btn btn-danger"
                        config={this.deleteActionButtonConfig}
                        callback={this.handleDeleteClicked} />
                    &nbsp;
                    <Link
                        className="btn btn-default"
                        to={`/changes/${this.props.params.id}/edit`}>
                        <span className="glyphicon glyphicon-pencil" />
                        &nbsp;
                        Rediģēt
                    </Link>
                </p>
                <p><strong>Datums:</strong> {formatDate(this.data.change.for_date)}</p>
                <ol start="0">
                {this.data.change.lessons.map((lesson, i) =>
                <li key={i}>
                    {lesson || '–'}
                </li>
                )}
                </ol>
            </div>;
            /*jshint ignore:end */
        } else if (this.state.error) {
            /*jshint ignore:start */
            return <div>
                <div className="alert alert-danger">
                    <strong>Ak vai!</strong>&nbsp;
                    Mēģinot parādīt šo lapu, radās kļūda:&nbsp;
                    <code>{`${this.state.error}`}</code>
                </div>
            </div>;
            /*jshint ignore:end */
        } else {
            /*jshint ignore:start */
            return <div>
                <h1>Izmaiņas … klasei</h1>
                <p>Notiek ielāde…</p>
            </div>;
            /*jshint ignore:end */
        }
    }
});

module.exports = { ChangeHandler: ChangeHandler };
