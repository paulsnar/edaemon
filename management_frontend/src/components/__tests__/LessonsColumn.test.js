/*jshint ignore:start */
'use strict';

describe('LessonsColumn', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var _ = require('lodash');

    var LessonsColumn;
    beforeEach(function() {
        LessonsColumn = rewire('../LessonsColumn');
    });

    it('should render fine without external input', function() {
        expect(() => ReactTestUtils.renderIntoDocument(<LessonsColumn />))
            .not.toThrow();
    });

    it('should trim unnecessary trailing empty fields on serialization', function() {
        var component = ReactTestUtils.renderIntoDocument(<LessonsColumn />);

        component.setState({
            lessons: ['0', '1', '2', '', '', '', '', '', '', '', '', '', '', '']
        });

        var lessons = component.serialize();

        expect(lessons).toEqual(['0', '1', '2']);
    });

    it('should add more fields when the last field is focused', function() {
        var component = ReactTestUtils.renderIntoDocument(<LessonsColumn />);
        var previousLength = component.state.lessons.length;

        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component,
            'input');

        var lastInput = inputs[inputs.length - 1];
        var lastInputNode = ReactDOM.findDOMNode(lastInput);

        ReactTestUtils.Simulate.focus(lastInputNode);

        expect(component.state.lessons.length).toBeGreaterThan(previousLength);
    });

    it('should pre-fill state if lessons prop is passed', function() {
        var lessons = [ 'lesson0', 'lesson1', 'lesson2',
                        'lesson3', 'lesson4', 'lesson5' ];
        var component = ReactTestUtils.renderIntoDocument(<LessonsColumn
            lessons={lessons} />);

        expect(component.serialize()).toEqual(lessons);
    });

    it('should leave the last field empty when initiated w/ prop', function() {
        var lessons = [ 'lesson0', 'lesson1', 'lesson2',
                        'lesson3', 'lesson4', 'lesson5' ];
        var component = ReactTestUtils.renderIntoDocument(<LessonsColumn
            lessons={lessons} />);

        var inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component,
            'input');

        expect(inputs.length).toBeGreaterThan(lessons.length);
    });

    it('should return (serialized) data in specified layout (test without trailing empties)', function() {
        var preserialized = ['zero', 'one', 'two', 'three', 'four', 'five'];

        var component = ReactTestUtils.renderIntoDocument(<LessonsColumn />);
        component.setState({ lessons: preserialized });

        expect(component.serialize()).toEqual(preserialized);
    });

    it('should return (serialized) data in specified layout (test with trailing empties)', function() {
        var preserialized = ['zero', 'one', 'two', 'three', 'four', 'five'];
        var _p = preserialized.concat(['', '', '', '', '']);

        var component = ReactTestUtils.renderIntoDocument(<LessonsColumn />);
        component.setState({ lessons: _p });

        expect(component.serialize()).toEqual(preserialized);
    })
});
