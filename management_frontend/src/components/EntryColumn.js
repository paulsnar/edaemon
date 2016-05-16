'use strict';

import React from 'react';

export default class EntryColumn extends React.Component {
    constructor(props) {
        super(props);

        if (props.data) {
            this.state = {
                className: props.data.className,
                lessons: props.data.lessons.slice()
            }
        } else {
            this.state = {
                className: '',
                lessons: []
            }
        }

        // pad for static or dynamic minimum height
        if (props.fixedHeight) {
            if (this.state.lessons.length < 9) {
                while (this.state.lessons.length < 9) {
                    this.state.lessons.push('');
                }
            }
        } else {
            if (this.state.lessons.length < 7) {
                while (this.state.lessons.length < 7) {
                    this.state.lessons.push('');
                }
            }
        }
    }
    validate() {
        for (let i = this.state.lessons.length - 1; i >= 0; i--) {
            if (this.state.lessons[i] !== '') {
                return this.state.className.trim() !== '';
            }
        }
        return null;
    }
    serialize() {
        return {
            className: this.state.className.trim(),
            lessons: this.props.fixedHeight ?
                this.state.lessons.slice() :
                this.state.lessons.slice(0, -1) // trim off empty +th entry
        }
    }
    _handleClassnameChange(e) {
        this.setState({ className: e.target.value.trim() });
    }
    _handleLessonChange(i, e) {
        let lessons = this.state.lessons.slice();
        lessons[i] = e.target.value.trim();
        this.setState({ lessons });
    }
    _handleLessonFocus(i, e) {
        if (this.props.fixedHeight) return;
        if (i === this.state.lessons.length - 1) {
            let lessons = this.state.lessons.slice();
            lessons.push('');
            this.setState({ lessons });
        }
    }
    render() {
        let className = this.props.className || '';
        return <div className={className}>
            <div className="input-group">
                <span className="input-group-addon">Klase: </span>
                <input type="text" className="form-control"
                    value={this.state.className}
                    onChange={this._handleClassnameChange.bind(this)} />
            </div>
            {this.state.lessons.map((item, i) =>
            <div className="input-group" key={i}>
                <span className="input-group-addon">
                    {(!this.props.fixedHeight && i === this.state.lessons.length - 1) ? '+' : i}.
                </span>
                <input type="text" className="form-control"
                    value={item}
                    onChange={this._handleLessonChange.bind(this, i)}
                    onFocus={this._handleLessonFocus.bind(this, i)} />
            </div>
            )}
        </div>;
    }
}
