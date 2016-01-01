/*jshint ignore:start */
'use strict';

describe('DefaultChange', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var change = {
        id: '12345678901234567890',
        for_class: 'dummy class',
        for_date: '2015-12-01'
    };

    var DefaultChange;
    beforeEach(function() {
        DefaultChange = rewire('../DefaultChange');
    });

    it('should render when passed a Change object', function() {
        expect(() => ReactTestUtils.renderIntoDocument(<DefaultChange
            change={change} />)).not.toThrow();
    });

    it('should call Data.changes.delete when ConfirmActionButton is clicked twice', function() {
        var Data = {
            changes: {
                delete: function() {
                    return new Promise(res => res({ success: true }));
                }
            }
        };
        var spy = sinon.spy(Data.changes, 'delete');
        DefaultChange.__set__('Data', Data);

        var component = ReactTestUtils.renderIntoDocument(<DefaultChange
            change={change} />);
        var btn = ReactTestUtils.findRenderedComponentWithType(component,
            DefaultChange.__get__('ConfirmActionButton'));
        var btnNode = ReactDOM.findDOMNode(btn);
        ReactTestUtils.Simulate.click(btnNode);
        ReactTestUtils.Simulate.click(btnNode);

        expect(spy.called).toEqual(true);
    });

    it('should call self-removal callback once the delete operation succeeds', function(done) {
        var Data = {
            changes: {
                delete: function() {
                    return new Promise(res => res({ success: true }));
                }
            }
        };
        DefaultChange.__set__('Data', Data);

        var spy = sinon.spy();
        var component = ReactTestUtils.renderIntoDocument(<DefaultChange
            change={change} removeCallback={spy} />);

        var btn = ReactTestUtils.findRenderedComponentWithType(component,
            DefaultChange.__get__('ConfirmActionButton'));
        var btnNode = ReactDOM.findDOMNode(btn);
        ReactTestUtils.Simulate.click(btnNode);
        ReactTestUtils.Simulate.click(btnNode);

        setTimeout(function() {
            expect(spy.called).toEqual(true);

            done();
        }, 50);
    });
});
