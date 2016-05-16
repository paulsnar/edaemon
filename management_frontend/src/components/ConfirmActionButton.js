'use strict';

import React from 'react';

export default class ConfirmActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            timeout: null
        }
    }
    handleClicked() {
        if (this.state.clicked) {
            window.cancelTimeout(this.state.timeout);
            this.props.callback();
        } else {
            let timeout = window.setTimeout(() => {
                this.setState({ clicked: false, timeout: null });
            }, 6000);
            this.setState({ clicked: true, timeout });
        }
    }
    render() {
        return <button onClick={this.handleClicked.bind(this)} {...this.props}>
            {this.state.clicked ? 'Tiešām?' : this.props.children}
        </button>;
    }
}
