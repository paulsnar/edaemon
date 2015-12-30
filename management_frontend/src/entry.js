/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');
var ReactDOM = require('react-dom');
var render = ReactDOM.render;

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;

var Data = require('./data');
var Navbar = require('./components/Navbar').Navbar;

var history = require('./history');

var IndexHandler = require('./routes/index').IndexHandler;
var NewChangeHandler = require('./routes/new_change').NewChangeHandler;
var ChangeHandler = require('./routes/change').ChangeHandler;
var AllChangesHandler = require('./routes/all_changes').AllChangesHandler;
var EditChangeHandler = require('./routes/edit_change');
var NewTimetableHandler = require('./routes/new_timetable');
var EditTimetableHandler = require('./routes/edit_timetable');

var App = React.createClass({
    render: function() {
        /* jshint ignore:start */
        return <div>
            <Navbar />
            <div className="container" style={{ paddingTop: '70px' }}>
                {this.props.children}
            </div>
        </div>;
        /* jshint ignore:end */
    }
});

render(
    /* jshint ignore:start */
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={IndexHandler} />
            <Route path="/changes/new" component={NewChangeHandler} />
            <Route path="/changes/all" component={AllChangesHandler} />
            <Route path="/changes/:id" component={ChangeHandler} />
            <Route path="/changes/:id/edit" component={EditChangeHandler} />

            <Route path="/timetables/new" component={NewTimetableHandler} />
            <Route path="/timetables/:id/edit" component={EditTimetableHandler} />
        </Route>
    </Router>,
    /* jshint ignore: end */
    document.getElementById('js__content')
);
