'use strict';

import Inferno from 'inferno';
import Component from 'inferno-component';
import createElement from 'inferno-create-element';

export default class ConfirmActionButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        }
    }
    handleClicked() {
        if (this.state.clicked) {
            this.props.callback();
            if (!this._unmounted) {
                // Inferno sometimes does weird optimizations, which means that
                // components might be left lingering after removal. That
                // requires to check each component and reset their state
                // manually.
                this.setState({ clicked: false });
            }
        } else {
            this.setState({ clicked: true });
        }
    }
    render() {
        return <button onClick={this.handleClicked.bind(this)} {...this.props}>
            {this.state.clicked ? 'Tiešām?' : this.props.children}
        </button>;
    }
}
