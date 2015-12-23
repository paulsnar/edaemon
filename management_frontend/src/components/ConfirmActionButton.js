'use strict';

import React from 'react';

let ConfirmActionButton = React.createClass({
    getInitialState() {
        return { confirm: false, processing: false, error: false };
    },
    handleClicked() {
        if (this.state.processing) {
            // noop
        } else if (this.state.confirm) {
            this.setState({ confirm: false, processing: true });
            // shut up
        }
    }
})
