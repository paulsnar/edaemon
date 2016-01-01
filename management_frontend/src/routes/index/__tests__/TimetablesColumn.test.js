/*jshint ignore:start */
'use strict';

describe('route: / → TimetablesColumn', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var TimetablesColumn;
    beforeEach(function() {
        TimetablesColumn = rewire('../TimetablesColumn');
    });

    function generateTimetables() {
        var timetables = [ ];
        for (var i = 0; i < 3; i++) {
            var timetable = { for_class: 'random' };
            timetable.id = 'timetable_random_' + Math.floor(Math.random() * 2000);
            timetables.push(timetable);
        }
        return timetables;
    };

    var mock = {
        timetables: [
            { id: 'timetable_1', for_class: '1.z' },
            { id: 'timetable_2', for_class: '2.z' },
            { id: 'timetable_3', for_class: '3.z' },
        ],
        Data: {
            timetables: {
                getAll: function() {
                    return new Promise(res => res({ timetables: mock.timetables }));
                }
            }
        },
        rp: {
            rpc: {
                call: function() { }
            }
        }
    };

    it('should request Data.timetables.getAll on load', function() {
        TimetablesColumn.__set__('rp', mock.rp);
        var Data = {
            timetables: {
                getAll: function() { return mock.Data.timetables.getAll(); }
            }
        };
        var spy = sinon.spy(Data.timetables, 'getAll');
        TimetablesColumn.__set__('Data', Data);

        var page = ReactTestUtils.renderIntoDocument(<TimetablesColumn />);

        expect(spy.calledOnce).toEqual(true);
    });

    it('should call the spinner RPCs while loading', function(done) {
        var rp = { rpc: { call: function() { } } };
        var spy = sinon.spy(rp.rpc, 'call');
        TimetablesColumn.__set__('rp', rp);

        TimetablesColumn.__set__('Data', mock.Data);

        var page = ReactTestUtils.renderIntoDocument(<TimetablesColumn />);

        setTimeout(function() {
            // give some time to promises to settle
            expect(spy.withArgs('spinner.start').callCount).toEqual(
                spy.withArgs('spinner.stop').callCount);

            done();
        }, 100);
    });

    it('should use DefaultTimetable for displaying timetable entries', function() {
        var DefaultTimetable = React.createClass({
            render: function() {
                return <span />;
            }
        });
        TimetablesColumn.__set__('DefaultTimetable', DefaultTimetable);

        var _timetables = generateTimetables();
        var Data = {
            timetables: {
                getAll: function() {
                    return new Promise(res => res({ timetables: _timetables }));
                }
            }
        };
        TimetablesColumn.__set__('Data', Data);

        TimetablesColumn.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<TimetablesColumn />);
        // force load
        component.data.timetables = _timetables;
        component.setState({ loaded: true });
        var timetableComponents = ReactTestUtils.scryRenderedComponentsWithType(
            component, DefaultTimetable);

        expect(timetableComponents.length).toEqual(_timetables.length);
    });
});
