'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ConfirmActionButton from './components/ConfirmActionButton';
import API from './api';

class ChangeListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.data.slice()
        };
    }
    _handleChildRemoving(index) {
        let items = this.state.items.slice();
        API.Change.delete(items[index].id);
        items.splice(index, 1);
        this.setState({ items });
    }
    render() {
        const _mappedItems = this.state.items.map((item, i) =>
            <li key={item.id}>
                <ConfirmActionButton className="btn btn-danger btn-xs"
                    callback={this._handleChildRemoving.bind(this, i)}>
                    <span className="glyphicon glyphicon-trash" />
                </ConfirmActionButton>
                {' '}
                <a className="btn btn-default btn-xs"
                    href={`/admin/changes/${item.id}/edit`}>
                    <span className="glyphicon glyphicon-pencil" />
                </a>
                {' '}
                <a href={`/admin/changes/${item.id}`}>
                    Datums: {item.for_date}, klase: {item.for_class}
                </a>
            </li>
        );
        return <ul>
            {_mappedItems}
        </ul>;
    }
}

let ChangeList = {
    init: (target, data) => {
        target.innerHTML = '';

        ReactDOM.render(
            <ChangeListComponent data={data} />,
            target
        );
    }
}

export default ChangeList;
