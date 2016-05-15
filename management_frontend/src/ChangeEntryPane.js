'use strict';

import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';
import Component from 'inferno-component';
import createElement from 'inferno-create-element';

import API from './api';

class ChangeEntryPaneComponent extends Component {
    constructor(props) {
        super(props);
        this.data = {
            date: '',
            items: [
                [ /* each row */
                    { className: '', lessons: ['', '', '', '', '', '', ''] }
                ]
            ]
        }
        this.state = {
            hasErrors: null
        }
    }
    _handleDateChange(e) {
        this.data.date = e.target.value;
    }
    _handleClassnameChange(rowI, classI, e) {
        this.data.items[rowI][classI].className = e.target.value;
        // this.forceUpdate();
    }
    _handleLessonChange(rowI, classI, lessonI, e) {
        this.data.items[rowI][classI].lessons[lessonI] = e.target.value;
        // this.forceUpdate();
    }
    _handleLessonFocus(rowI, classI, lessonI, e) {
        if (lessonI === this.data.items[rowI][classI].lessons.length - 1) {
            this.data.items[rowI][classI].lessons.push('');
            this.forceUpdate();
        }
    }
    _handleSaveClicked() {
        // flatten this.data.items
        let items = [ ];
        this.data.items.forEach(row => {
            items = items.concat(row);
        });
        API.Change.post({
            date: this.data.date,
            items
        });
    }
    _addColumn() {
        if (this.data.items[this.data.items.length - 1].length === 4) {
            this.data.items.push(
                [
                    { className: '', lessons: ['', '', '', '', '', '', ''] }
                ]
            );
        } else {
            this.data.items[this.data.items.length - 1].push(
                { className: '', lessons: ['', '', '', '', '', '', '' ] })
        }
        this.forceUpdate();
    }
    render() {
        return <div>
            <div className="row">
                <div className="col-md-3 form-inline">
                    <div className="input-group">
                        <span className="input-group-addon">Datums: </span>
                        <input type="date" className="form-control"
                            placeholder="YYYY-MM-DD"
                            onChange={this._handleDateChange.bind(this)} />
                    </div>
                </div>
            </div>
            {this.data.items.map((row, rowI) =>
            <div className="row">
                {row.map((_class, classI) =>
                <div className="col-md-3">
                    <div className="input-group">
                        <span className="input-group-addon">Klase: </span>
                        <input type="text" className="form-control"
                            onChange={this._handleClassnameChange.bind(this, rowI, classI)} />
                    </div>
                    {_class.lessons.map((item, i) =>
                    <div className="input-group">
                        <span className="input-group-addon">{i === _class.lessons.length - 1 ? '+' : i}.</span>
                        <input type="text" className="form-control" 
                            onChange={this._handleLessonChange.bind(this, rowI, classI, i)}
                            onFocus={this._handleLessonFocus.bind(this, rowI, classI, i)} />
                    </div>
                    )}
                </div>
                )}
                {row.length < 4 ?
                <div className="col-md-3">
                    <button className="btn btn-default btn-lg btn-block"
                        onClick={this._addColumn.bind(this)}>
                        <span className="glyphicon glyphicon-plus" />
                    </button>
                </div> : ''}
            </div>
            )}
            <div className="row" data-hack="row-last">
                {this.data.items[this.data.items.length - 1].length === 4 ?
                <div className="col-md-3">
                    <button className="btn btn-default btn-lg btn-block"
                        onClick={this._addColumn.bind(this)}>
                        <span className="glyphicon glyphicon-plus" />
                    </button>
                </div> : ''}
            </div>
            <p>
                <button className="btn btn-primary"
                    onClick={this._handleSaveClicked.bind(this)}>
                    <span className="glyphicon glyphicon-floppy-disk" />
                    {' '}
                    Saglabāt
                </button>
            </p>
        </div>;
    }
}

let ChangeEntryPane = {
    init: (target) => {
        target.innerHTML = '';
        InfernoDOM.render(
            <ChangeEntryPaneComponent />,
            target
        );
    }
}

export default ChangeEntryPane;
