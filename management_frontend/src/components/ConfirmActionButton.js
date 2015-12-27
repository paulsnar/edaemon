'use strict';

// import React from 'react';
var React = require('react');
// import _ from 'lodash';
var _ = require('lodash');

/**
 * Base button for all action (e.g. doubleclick) buttons to inherit.
 * Expects:
 * - callback: function(moreCallback)
 *   A function which will be called when action is taken. When the action
 *   has been done, you should call moreCallback with args
 *   (succeeded, newText, beDisabled), which should be quite self-explanatory.
 *   If you're going to unmount this button, you shouldn't call it.
 * - config: object
 *   - text: object
 *     - standby: string: the text to display initially, default: ''
 *     - confirm: string: the text to display when the button has been clicked once, default: 'Tiešām?'
 *     - processing: string: the text to display when the action is triggered/ongoing, default: 'Uzgaidiet…'
 *     - error: string: the text to display when the action has failed, default: 'Kļūda'
 *                      (can be overridden by the callback)
 *   - icon: object
 *     - base: string: icon class to prepend to all of the others with a separator space, default: 'glyphicon '
 *     - standby: string: icon class to display initially
 *     - confirm: string: icon class to display when button has been clicked once, default: same as standby
 *     - processing: string: icon class to display when action is processing, default: 'glyphicon-cog _spin'
 *     - error: string: icon class to display when action has failed, default: 'glyphicon-alert'
 */

var ConfirmActionButton = React.createClass({
    getInitialState: function() {
        return { confirm: false, processing: false, disabled: false, error: false };
    },
    handleClicked: function() {
        if (this.state.processing) {
            // third click
            // noop
        } else if (this.state.confirm) {
            // second click
            this.setState({ confirm: false, processing: true, disabled: true });
            if (this.props.callback) {
                this.props.callback((success, newText, disabled) => {
                    disabled = disabled || false;
                    // onError
                    if (newText) {
                        this.setState({ processing: false, error: !success,
                            text: newText, disabled: disabled });
                    } else {
                        this.setState({ processing: false, error: !success,
                            disabled: disabled });
                    }
                });
            }
        } else {
            // first click
            this.setState({ error: false, errorText: null, confirm: true });
        }
    },
    render: function() {
        // let c = this.props.config;
        var c = { };
        _.defaultsDeep(c, this.props.config, {
            text: {
                standby: '',
                confirm: 'Tiešām?',
                processing: 'Uzgaidiet…',
                error: 'Kļūda'
            },
            icon: {
                base: 'glyphicon ',
                confirm: this.props.config.icon.standby,
                processing: 'glyphicon-cog _spin',
                error: 'glyphicon-alert'
            }
        });
        var _innerText, _iconClass, _disabled = false;
        if (this.state.confirm) {
            _innerText = c.text.confirm;
            _iconClass = c.icon.base + c.icon.confirm;
        } else if (this.state.error) {
            _innerText = c.text.error;
            _iconClass = c.icon.base + c.icon.error;
        } else if (this.state.processing) {
            _innerText = c.text.processing;
            _iconClass = c.icon.base + c.icon.processing;
            _disabled = true;
        } else {
            _innerText = c.text.standby;
            _iconClass = c.icon.base + c.icon.standby;
        }
        if (this.state.text) {
            _innerText = this.state.text;
        }
        if (this.state.disabled) {
            _disabled = true;
        }
        return <button
            className={(this.props.className || 'btn btn-default') +
                (_disabled ? ' disabled' : '')}
            onClick={this.handleClicked}>
            <span className={_iconClass} />&nbsp;
            {_innerText}
        </button>
    }
});

// export default ConfirmActionButton;
module.exports = ConfirmActionButton;
