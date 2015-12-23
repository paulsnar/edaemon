'use strict';

import React from 'react';
import Spin from 'spin';

import { rpc, events } from '../../rp';

let Spinner = React.createClass({
    componentDidMount() {
        this.spinner = new Spin({
            length: 6,
            width: 3,
            radius: 9,
            color: '#ffffff',
            position: 'absolute',
            left: '50%',
            top: '50%',
            shadow: true,
            hwaccel: true
        });
        this._s = 0;
        events.subscribe('spinner.start', this.startSpinner);
        events.subscribe('spinner.stop', this.stopSpinner);
    },
    startSpinner() {
        // this spinner is a semaphore
        this._s++;
        if (this._s > 0)
            this.spinner.spin(this.refs.spinner);
    },
    stopSpinner() {
        this._s--;
        if (this._s <= 0)
            this.spinner.stop();
    },
    render() {
        return <a ref="spinner" className="disabled" style={{ color: 'transparent' }}>&nbsp;</a>;
    }
});

export { Spinner };
