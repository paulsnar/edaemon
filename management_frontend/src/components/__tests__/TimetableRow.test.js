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

        component.refs.className.value = '1.0';

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
        component.refs.className.value = preserialized.className;
        component.refs[0].setState({ lessons: preserialized.lessons.mon });
        component.refs[1].setState({ lessons: preserialized.lessons.tue });
        component.refs[2].setState({ lessons: preserialized.lessons.wed });
        component.refs[3].setState({ lessons: preserialized.lessons.thu });
        component.refs[4].setState({ lessons: preserialized.lessons.fri });

        expect(component.serialize()).toEqual(preserialized);
    });
});
