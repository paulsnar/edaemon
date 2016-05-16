'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Settings from './settings';

const EASE = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;

class UserSettingsPaneComponent extends React.Component {
    constructor(props) {
        super(props);
        const glossary = props.glossary || { };
        this.state = {
            items: Object.keys(props.settings),
        }
        this.state.names = this.state.items.map(i => glossary[i] || i);
        this.state.values = this.state.items.map(i => props.settings[i]);
        this.state.itemsAnimating = this.state.items.map(i => false);
    }
    _handleCheckboxChanged(i, e) {
        let values = this.state.values.slice();
        // this.state.values[i] = e.target.checked;
        values[i] = e.target.checked;
        this.setState({ values });

        Settings.set(this.state.items[i], e.target.checked)
        .then(() => {
            let itemsAnimating = this.state.itemsAnimating.slice();
            itemsAnimating[i] = true;
            this.setState({ itemsAnimating });
        });
    }
    _handleAnimationEnd(i, e) {
        let itemsAnimating = this.state.itemsAnimating.slice();
        itemsAnimating[i] = false;
        this.setState({ itemsAnimating });
    }
    render() {
        return <div>
            {this.state.items.map((item, i) =>
                <p key={item}>
                    <label>
                        <input type="checkbox" checked={this.state.values[i]}
                            onChange={this._handleCheckboxChanged.bind(this, i)} />
                        {' '}
                        {this.state.names[i]}
                    </label>
                    &nbsp;
                    <span className={this.state.itemsAnimating[i] ? 'fadeOutNow' : 'hidden'}
                        onAnimationEnd={this._handleAnimationEnd.bind(this, i)}>
                        saglabāts
                    </span>
                </p>
            )}
        </div>
    }
}

const UserSettingsPane = {
    init: (target) => {
        target.innerHTML = '';
        Settings.init();
        Settings.getAll()
        .then(settings => {
            ReactDOM.render(
                <UserSettingsPaneComponent settings={settings}
                    glossary={Settings.names} />,
                target
            );
        });
    }
}

export default UserSettingsPane;
