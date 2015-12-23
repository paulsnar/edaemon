'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link } from 'react-router';

import Data from './data';
import { Navbar } from './components/Navbar';

import { IndexHandler } from './routes/index';
import { NewChangeHandler } from './routes/new_change';
import { ChangeHandler } from './routes/change';
import { AllChangesHandler } from './routes/all_changes';

let App = React.createClass({
    render() {
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
