/*jshint -W097 */
'use strict';

var React = require('react');
var Link = require('react-router').Link;
var _ = require('lodash');
var rp = require('../../rp');
var Data = require('../../data');

var DefaultTimetable = require('../../components/DefaultTimetable');

var TimetablesColumn = React.createClass({
    getInitialState: function() {
        return { loaded: false };
    },
    componentDidMount: function() {
        rp.rpc.call('spinner.start');
        this.data = { };
        /*jshint -W119 */
        Data.timetables.getAll().then(resp => {
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.data.timetables = resp.timetables;
            this.setState({ loaded: true });
        });
        /*jshint +W119 */
    },
    loadMore: function(cursor) {
        rp.rpc.call('spinner.start');
        Data.timetables.getAll(cursor).then(resp => {
            rp.rpc.call('spinner.stop');
            if (!this.isMounted()) return;
            this.data.timetables = this.data.timetables.concat(resp.timetables);
            if (resp.cursor) {
                this.setState({ cursor: resp.cursor });
            } else {
                this.setState({ cursor: null });
            }
        });
    },
    removeChild: function(timetable) {
        _.remove(this.data.timetables, timetable);
        this.forceUpdate();
    },
    render: function() {
        var timetables, loadMoreButton;
        if (this.state.loaded) {
            /*jshint ignore:start */
            timetables = <ul>
                {this.data.timetables.map(timetable =>
                <li key={timetable.id}>
                    <DefaultTimetable
                        timetable={timetable}
                        removeCallback={this.removeChild.bind(this, timetable)} />
                </li>
                )}
            </ul>;
            /*jshint ignore:end */
        } else {
            /*jshint ignore:start */
            timetables = <p>Mazlietiņ uzgaidiet, lūdzu…</p>;
            /*jshint ignore:end */
        }
        if (this.state.cursor) {
            /*jshint ignore:start */
            loadMoreButton = <button className="btn btn-default"
                onClick={this.loadMore.bind(this, this.state.cursor)}>
                <span className="glyphicon glyphicon-asterisk" />&nbsp;
                Ielādēt vairāk
            </button>;
            /*jshint ignore:end */
        } else {
            loadMoreButton = '';
        }
        /*jshint ignore:start */
        return <div className={this.props.className}>
            <h2>Stundu saraksti</h2>
            {timetables}
            <p>
                {loadMoreButton}
                &nbsp;
                <Link to="/timetables/new" className="btn btn-primary">
                    <span className="glyphicon glyphicon-plus" />&nbsp;
                    Ievadīt jaunu
                </Link>
            </p>
        </div>;
        /*jshint ignore:end */
    }
});

module.exports = TimetablesColumn;
