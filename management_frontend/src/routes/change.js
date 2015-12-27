/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');

var formatDate = require('../i18n').formatDate;
var rp = require('../rp');
var Data = require('../data');

var ChangeHandler = React.createClass({
    componentDidMount: function() {
        rp.events.publish('spinner.start');
        this.data = { };
        /*jshint -W119 */
        Data.changes.get(this.props.params.id).then(change => {
        /*jshint +W119 */
            rp.events.publish('spinner.stop');
            if (!this.isMounted()) return;
            this.data.change = change.change;
            this.setState({ loaded: true });
        /*jshint -W119 */
        }).catch(err => {
        /*jshint +W119 */
            rp.events.publish('spinner.stop');
            console.log(err);
            if (!this.isMounted()) return;
            this.setState({ error: err });
        });
    },
    getInitialState: function() {
        return { loaded: false };
    },
    render: function() {
        if (this.state.loaded) {
            /*jshint ignore:start */
            return <div>
                <h1>Izmaiņas {this.data.change.for_class} klasei</h1>
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
