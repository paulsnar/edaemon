/*jshint ignore:start */
'use strict';

describe('LessonsColumn', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var LessonsColumn;
    beforeEach(function() {
        LessonsColumn = rewire('../LessonsColumn');
    });

    it('should render fine without external input', function() {
        expect(ReactTestUtils.renderIntoDocument(<LessonsColumn />))
            .not.toThrow();
    });

    it('should trim unnecessary trailing empty fields on serialization', function() {
        var component = ReactTestUtils.renderIntoDocument(<LessonsColumn />);

        component.setState({
            lessons: ['0', '1', '2', '', '', '', '', '', '', '', '', '', '', '']
        });

        var lessons = component.serialize();

        expect(lessons.length).toEqual(3);
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

    it('should pre-fill fields if lessons prop is passed', function() {
        var lessons = [ 'lesson0', 'lesson1', 'lesson2',
                        'lesson3', 'lesson4', 'lesson5'];
        var component = ReactTestUtils.renderIntoDocument(<LessonsColumn
            lessons={lessons} />);

        expect(component.state.lessons).toEqual(lessons);
    });
});
