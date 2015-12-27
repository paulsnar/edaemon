'use strict';

// import React from 'react';
var React = require('react');
// import { Link } from 'react-router';
var Link = require('react-router').Link;

// import { rpc, events } from '../../rp';
var rp = require('rp');
// import { Spinner } from './Spinner';
var Spinner = require('./Spinner').Spinner;

var Navbar = React.createClass({
    render: function() {
        return <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button type="button"
                        className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target=".navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                    </button>
                    <Link className="navbar-brand" to="/">
                        Edaemon <sup>ADMIN</sup>
                    </Link>
                </div>

                <div className="collapse navbar-collapse">
                    <div className="navbar-form navbar-left btn-group">
                        <button className="btn btn-default dropdown-toggle"
                            data-toggle="dropdown"
                            ref={(c) => { $(c).dropdown(); }}>
                            <span className="glyphicon glyphicon-plus" />
                        </button>
                        <ul className="dropdown-menu">
                            <li><Link to="/changes/new">Izmaiņas</Link></li>
                        </ul>
                    </div>
                    <ul className="nav navbar-nav navbar-left">
                        <li>
                            <Link to="/changes/all">
                                Visas izmaiņas
                            </Link>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <Spinner />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>;
    }
});

// export { Navbar };
module.exports = { Navbar: Navbar };
