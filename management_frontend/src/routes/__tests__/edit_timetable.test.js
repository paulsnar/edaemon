/*jshint ignore:start */
'use strict';

describe('route: /timetables/:id/edit', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var mock = {
        timetable: {
            id: 'test_id_1000',
            for_class: '1.0',
            plan: {
                mon: ['zero', 'one', 'two', 'three', 'four', 'five'],
                tue: ['nulle', 'viens', 'divi', 'trīs', 'četri', 'pieci'],
                wed: ['0', '1', '2', '3', '4', '5'],
                thu: ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth'],
                fri: ['nulltā', 'pirmā', 'otrā', 'trešā', 'ceturtā', 'piektā']
            }
        },
        Data: {
            timetables: {
                get: function() {
                    return new Promise(res => res({ timetable: mock.timetable }));
                }
                // not mocking .edit here
            }
        },
        rp: {
            rpc: {
                call: function() { }
            }
        }
    };

    var EditTimetableHandler;

    beforeEach(function() {
        EditTimetableHandler = rewire('../edit_timetable');
    });

    it('should render when loaded', function() {
        EditTimetableHandler.__set__('rp', mock.rp);
        EditTimetableHandler.__set__('Data', mock.Data);

        expect(() => ReactTestUtils.renderIntoDocument(<EditTimetableHandler
            params={{ id: mock.timetable.id }} />)).not.toThrow();
    });

    it('should call the spinner RPCs while loading', function(done) {
        var rp = {
            rpc: {
                call: function() { }
            }
        };
        var spy = sinon.spy(rp.rpc, 'call');
        EditTimetableHandler.__set__('rp', rp);
        EditTimetableHandler.__set__('Data', mock.Data);

        var component = ReactTestUtils.renderIntoDocument(<EditTimetableHandler
            params={{ id: mock.timetable.id }} />);

        setTimeout(function() {
            expect(spy.withArgs('spinner.start').callCount).toEqual(
                spy.withArgs('spinner.stop').callCount);

            done();
        }, 100);
    });

    it('should load data from Data on load', function() {
        var Data = {
            timetables: {
                get: function() { return mock.Data.timetables.get(); }
            }
        };
        var spy = sinon.spy(Data.timetables, 'get');
        EditTimetableHandler.__set__('Data', Data);
        EditTimetableHandler.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<EditTimetableHandler
            params={{ id: mock.timetable.id }} />);

        expect(spy.called).toEqual(true);
    });

    it('should not submit until all the required fields are filled out', function() {
        var _precondition = false;
        var Data = {
            timetables: {
                get: function() { return mock.Data.timetables.get(); },
                edit: function(id) {
                    if (!_precondition) {
                        fail('Data.timetables.edit was called');
                    } else {
                        return new Promise(res => {
                            res({ success: true });
                        });
                    }
                }
            }
        };
        var spy = sinon.spy(Data.timetables, 'edit');
        EditTimetableHandler.__set__('Data', Data);
        EditTimetableHandler.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<EditTimetableHandler
            params={{ id: mock.timetable.id }} />);
        // force load
        component.data.timetable = mock.timetable;
        component.setState({ loaded: true });

        var row = component.refs.timetable;
        row.setState({ className: '' });
        component.save();
        expect(spy.called).toEqual(false);

        row.setState({ className: mock.timetable.for_class });
        _precondition = true;
        component.save();
        expect(spy.called).toEqual(true);
    });
});
