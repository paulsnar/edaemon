/*jshint ignore:start */
'use strict';

describe('DefaultTimetable', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var timetable = {
        id: '12345678901234567890',
        for_class: 'dummy class'
    };

    var DefaultTimetable;
    beforeEach(function() {
        DefaultTimetable = rewire('../DefaultTimetable');
    });

    it('should render when passed a Timetable object', function() {
        expect(() => ReactTestUtils.renderIntoDocument(<DefaultTimetable
            timetable={timetable} />)).not.toThrow();
    });

    it('should call Data.timetables.delete when ConfirmActionButton is clicked twice', function() {
        var Data = {
            timetables: {
                delete: function() {
                    return new Promise(res => res({ success: true }));
                }
            }
        };
        var spy = sinon.spy(Data.timetables, 'delete');
        DefaultTimetable.__set__('Data', Data);

        var component = ReactTestUtils.renderIntoDocument(<DefaultTimetable
            timetable={timetable} />);
        var btn = ReactTestUtils.findRenderedComponentWithType(component,
            DefaultTimetable.__get__('ConfirmActionButton'));
        var btnNode = ReactDOM.findDOMNode(btn);
        ReactTestUtils.Simulate.click(btnNode);
        ReactTestUtils.Simulate.click(btnNode);

        expect(spy.called).toEqual(true);
    });

    it('should call self-removal callback once the delete operation succeeds', function(done) {
        var Data = {
            timetables: {
                delete: function() {
                    return new Promise(res => res({ success: true }));
                }
            }
        };
        DefaultTimetable.__set__('Data', Data);

        var spy = sinon.spy();
        var component = ReactTestUtils.renderIntoDocument(<DefaultTimetable
            timetable={timetable} removeCallback={spy} />);

        var btn = ReactTestUtils.findRenderedComponentWithType(component,
            DefaultTimetable.__get__('ConfirmActionButton'));
        var btnNode = ReactDOM.findDOMNode(btn);
        ReactTestUtils.Simulate.click(btnNode);
        ReactTestUtils.Simulate.click(btnNode);

        setTimeout(function() {
            expect(spy.called).toEqual(true);

            done();
        }, 50);
    });
});
