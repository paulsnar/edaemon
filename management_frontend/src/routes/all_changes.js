/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');
var _ = require('lodash');
var rp = require('../rp');
var Data = require('../data');

var DefaultChange = require('../components/DefaultChange');

var AllChangesHandler = React.createClass({
    getInitialState: function() {
        return { loaded: false, changes: null };
    },
    componentDidMount: function() {
        rp.events.publish('spinner.start');
        this.data = { };
        /*jshint -W119 */
        Data.changes.getAll().then(resp => {
        /*jshint +W119 */
            rp.events.publish('spinner.stop');
            if (!this.isMounted()) return;
            this.data.changes = resp.changes;
            if (resp.cursor) {
                this.setState({ loaded: true, cursor: resp.cursor });
            } else {
                this.setState({ loaded: true, cursor: null });
            }
        /*jshint -W119 */
        }).catch(err => {
        /*jshint +W119 */
            this.setState({ error: err });
        });
    },
    removeChild: function(change) {
        _.remove(this.data.changes, change);
        this.forceUpdate();
    },
    loadMore: function() {
        rp.events.publish('spinner.start');
        /*jshint -W119 */
        Data.changes.getAll(this.state.cursor).then(resp => {
        /*jshint +W119 */
            rp.events.publish('spinner.stop');
            if (!this.isMounted()) return;
            this.data.changes = this.data.changes.concat(resp.changes);
            if (resp.cursor) {
                this.setState({ cursor: resp.cursor });
            } else {
                this.setState({ cursor: null });
            }
        });
    },
    render: function() {
        var changes, loadMore;
        if (this.state.loaded) {
            /*jshint ignore:start */
            changes = <ul>
                {this.data.changes.map(change =>
                    <li key={change.id}>
                        <DefaultChange
                            change={change}
                            removeCallback={this.removeChild.bind(this, change)} />
                    </li>
                )}
            </ul>;
            /*jshint ignore:end */
        } else {
            /*jshint ignore:start */
            changes = <p>Vienu mirklīti…</p>
            /*jshint ignore:end */
        }
        if (this.state.cursor) {
            /*jshint ignore:start */
            loadMore = <button className="btn btn-default" onClick={this.loadMore}>
                <span className="glyphicon glyphicon-asterisk" /> Ielādēt vairāk
            </button>;
            /*jshint ignore:end */
        }
        /*jshint ignore:start */
        return <div>
            <h1>Visas izmaiņas</h1>
            {changes}
            {loadMore}
        </div>;
        /*jshint ignore:end */
    }
});

module.exports = { AllChangesHandler: AllChangesHandler };
