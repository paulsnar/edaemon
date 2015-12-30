/*jshint ignore:start */
'use strict';

describe('TimetableRow', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var TimetableRow;

    beforeEach(function() {
        TimetableRow = rewire('../TimetableRow');
    });

    it('should render properly without any props', function() {
        expect(() => ReactTestUtils.renderIntoDocument(<TimetableRow />))
            .not.toThrow();
    });

    it('should render <LessonsColumn />s inside', function() {
        var component = ReactTestUtils.renderIntoDocument(<TimetableRow />);
        var lessonsColumns = ReactTestUtils.scryRenderedComponentsWithType(
            component, TimetableRow.__get__('LessonsColumn'));

        expect(lessonsColumns.length).toBeGreaterThan(0);
    });

    it('should not allow serializing until at least className is filled out', function() {
        var component = ReactTestUtils.renderIntoDocument(<TimetableRow />);

        expect(component.serialize()).toEqual(null);

        component.setState({ className: '1.0' });

        expect(component.serialize()).not.toEqual(null);
    });

    it('should return (serialized) data in specified layout', function() {
        var preserialized = {
            className: '1.0',
            lessons: {
                mon: ['zero', 'one', 'two', 'three', 'four', 'five'],
                tue: ['0', '1', '2', '3', '4', '5'],
                wed: ['nulle', 'viens', 'divi', 'trīs', 'četri', 'pieci'],
                thu: ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth'],
                fri: ['nulltā', 'pirmā', 'otrā', 'trešā', 'ceturtā', 'piektā']
            }
        };
        var component = ReactTestUtils.renderIntoDocument(<TimetableRow />);
        component.setState({ className: preserialized.className });
        component.refs[0].setState({ lessons: preserialized.lessons.mon });
        component.refs[1].setState({ lessons: preserialized.lessons.tue });
        component.refs[2].setState({ lessons: preserialized.lessons.wed });
        component.refs[3].setState({ lessons: preserialized.lessons.thu });
        component.refs[4].setState({ lessons: preserialized.lessons.fri });

        expect(component.serialize()).toEqual(preserialized);
    });

    it('should pre-fill state if timetable prop is passed', function() {
        var timetable = {
            for_class: '1.0',
            plan: {
                mon: ['zero', 'one', 'two', 'three', 'four', 'five'],
                tue: ['0', '1', '2', '3', '4', '5'],
                wed: ['nulle', 'viens', 'divi', 'trīs', 'četri', 'pieci'],
                thu: ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth'],
                fri: ['nulltā', 'pirmā', 'otrā', 'trešā', 'ceturtā', 'piektā']
            }
        };
        var component = ReactTestUtils.renderIntoDocument(<TimetableRow
            timetable={timetable} />);

        expect(component.state.className).toEqual(timetable.for_class);

        expect(component.refs[0].serialize()).toEqual(timetable.plan.mon);
        expect(component.refs[1].serialize()).toEqual(timetable.plan.tue);
        expect(component.refs[2].serialize()).toEqual(timetable.plan.wed);
        expect(component.refs[3].serialize()).toEqual(timetable.plan.thu);
        expect(component.refs[4].serialize()).toEqual(timetable.plan.fri);
    });
});
