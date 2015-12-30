/*jshint ignore:start */
'use strict';

describe('route: /timetables/new', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var NewTimetableHandler;

    beforeEach(function() {
        NewTimetableHandler = rewire('../new_timetable');
    });

    it('should render fine without any router passed params', function() {
        expect(() => ReactTestUtils.renderIntoDocument(<NewTimetableHandler />))
            .not.toThrow();
    });

    it('should not submit until all the required fields are filled out', function() {
        var _precondition = false;
        var Data = {
            timetables: {
                input: function() {
                    return new Promise((res, rej) => {
                        if (!_precondition) {
                            fail('Data.timetables.input was called');
                        } else {
                            res({ success: true });
                        }
                    });
                }
            }
        }
        var spy = sinon.spy(Data.timetables, 'input');
        NewTimetableHandler.__set__('Data', Data);

        var component = ReactTestUtils.renderIntoDocument(<NewTimetableHandler />);
        component.save();
        expect(spy.called).toEqual(false);

        var timetableRow = component.refs[0];
        timetableRow.refs.className.value = '1.0';
        _precondition = true;
        component.save();
        expect(spy.called).toEqual(true);
    });

    it('should submit data according to format', function(done) {
        var Data = {
            timetables: {
                input: function(data) {
                    expect(data.timetables).toBeDefined();
                    expect(data.timetables[0].className).toBeDefined();
                    expect(data.timetables[0].className).toEqual('1.0');
                    expect(data.timetables[0].lessons).toBeDefined();
                    done();
                    return new Promise(res => res({ success: true }));
                }
            }
        };
        NewTimetableHandler.__set__('Data', Data);

        var component = ReactTestUtils.renderIntoDocument(<NewTimetableHandler />);
        var timetableRow = component.refs[0];
        timetableRow.refs.className.value = '1.0';
        component.save();
    })
});
