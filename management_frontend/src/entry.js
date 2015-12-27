'use strict';

// import React from 'react';
var React = require('react');
// import { render } from 'react-dom';
var ReactDOM = require('react-dom');
var render = ReactDOM.render;
// import { Router, Route, IndexRoute, Link } from 'react-router';
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;

// import Data from './data';
var Data = require('./data');
// import { Navbar } from './components/Navbar';
var Navbar = require('./components/Navbar').Navbar;

// import { IndexHandler } from './routes/index';
var IndexHandler = require('./routes/index').IndexHandler;
// import { NewChangeHandler } from './routes/new_change';
var NewChangeHandler = require('./routes/new_change').NewChangeHandler;
// import { ChangeHandler } from './routes/change';
var ChangeHandler = require('./routes/change').ChangeHandler;
// import { AllChangesHandler } from './routes/all_changes';
var AllChangesHandler = require('./routes/all_changes').AllChangesHandler;

var App = React.createClass({
    render: function() {
        return <div>
            <Navbar />
            <div className="container" style={{ paddingTop: '70px' }}>
                {this.props.children}
            </div>
        </div>;
    }
});

render(<Router>
    <Route path="/" component={App}>
        <IndexRoute component={IndexHandler} />
        <Route path="/changes/new" component={NewChangeHandler} />
        <Route path="/changes/all" component={AllChangesHandler} />
        <Route path="/changes/:id" component={ChangeHandler} />
    </Route>
</Router>, document.getElementById('js__content'));
