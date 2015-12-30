/*jshint -W097 */
'use strict';
/*jshint unused: false */

var React = require('react');
var Link = require('react-router').Link;

var Spinner = require('./Spinner').Spinner;

var Navbar = React.createClass({
    render: function() {
        /*jshint ignore:start */
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
                            <li><Link to="/timetables/new">Stundu sarakstu</Link></li>
                        </ul>
                    </div>
                    <ul className="nav navbar-nav navbar-left">
                        <li>
                            <Link to="/changes/all">
                                Visas izmaiņas
                            </Link>
                        </li>
                        <li><a href="/">Atpakaļ pie Edaemon</a></li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <Spinner />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>;
        /*jshint ignore:end */
    }
});

module.exports = { Navbar: Navbar };
