/*jshint ignore:start */
'use strict';

describe('route: /changes/new', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var NewChangeHandler, new_change;

    beforeEach(function() {
        new_change = rewire('../new_change');
        NewChangeHandler = new_change.NewChangeHandler;
    });

    it('should render fine without any router passed params', function() {
        var page = ReactTestUtils.renderIntoDocument(<NewChangeHandler />);
        var domElement = ReactDOM.findDOMNode(page);

        expect(page).toBeDefined();
        expect(domElement.tagName.toLowerCase()).toEqual('div');
    });

    it('should not submit until all the required fields (date and classnames) are filled out', function() {
        var _precondition = false;
        var Data = {
            changes: {
                input: function() {
                    return new Promise((res, rej) => {
                        if (!_precondition) {
                            fail('Data.changes.input was called at a bad time');
                        } else {
                            res({ success: true, stored: {
                                '1.0': 'test_id_1000'
                            } });
                        }
                    });
                }
            }
        }
        var spy = sinon.spy(Data.changes, 'input');
        new_change.__set__('Data', Data);

        var page = ReactTestUtils.renderIntoDocument(<NewChangeHandler />);
        page.save();
        expect(spy.called).toEqual(false);

        page.setState({ date: '2015-12-12' });
        page.save();
        expect(spy.called).toEqual(false);


        page.setState({ classNames: ['1.0'] });
        _precondition = true;
        page.save();
        expect(spy.called).toEqual(true);
    });

    it('should submit data according to format', function(done) {
        var Data = {
            changes: {
                input: function(data) {
                    expect(data.date).toBeDefined();
                    expect(data.changes).toBeDefined();
                    expect(data.changes[0].className).toBeDefined();
                    expect(data.changes[0].lessons).toBeDefined();
                    done();
                    return new Promise((res, rej) => {
                        res({ success: true, stored: {
                            '1.0': '1_1000'
                        } });
                    });
                }
            }
        }
        new_change.__set__('Data', Data);

        var page = ReactTestUtils.renderIntoDocument(<NewChangeHandler />);
        page.setState({ date: '2015-12-12', classNames: ['1.0'] });

        var lessonsColumn = page.refs[0];

        lessonsColumn.setState({ lessons: ['a', 'b', 'c', 'd', 'e', 'f'] });
        page.save();
    });
});
