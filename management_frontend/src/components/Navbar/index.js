'use strict';

import React from 'react';
import { Link } from 'react-router';

import { rpc, events } from '../../rp';
import { Spinner } from './Spinner';

let Navbar = React.createClass({
    render() {
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
                    <ul className="nav navbar-nav">
                        <li><Link to="/">Something something</Link></li>
                        <li><Link to="/">Something something</Link></li>
                        <li><Link to="/">Something something</Link></li>
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
})

export { Navbar };
