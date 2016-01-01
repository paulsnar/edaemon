/*jshint ignore:start */
'use strict';

describe('ConfirmActionButton', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var ConfirmActionButton;

    beforeEach(function() {
        ConfirmActionButton = rewire('../ConfirmActionButton');
    });

    it('should render, even without any props', function() {
        expect(() => ReactTestUtils.renderIntoDocument(<ConfirmActionButton />))
            .not.toThrow();
    });

    it('should not call the callback if it is clicked only once', function() {
        var callback = sinon.spy();
        var component = ReactTestUtils.renderIntoDocument(
            <ConfirmActionButton callback={callback} />);
        var rendered = ReactDOM.findDOMNode(component);

        ReactTestUtils.Simulate.click(rendered);

        expect(callback.called).toEqual(false);
    });

    it('should call the callback on the second click', function() {
        var callback = sinon.spy();
        var component = ReactTestUtils.renderIntoDocument(
            <ConfirmActionButton callback={callback} />);
        var rendered = ReactDOM.findDOMNode(component);

        ReactTestUtils.Simulate.click(rendered);
        ReactTestUtils.Simulate.click(rendered);

        expect(callback.calledOnce).toEqual(true);
    });

    it('should not allow new clicks until the callback returns the call', function() {
        var callback = sinon.spy();
        var component = ReactTestUtils.renderIntoDocument(
            <ConfirmActionButton callback={callback} />);
        var rendered = ReactDOM.findDOMNode(component);

        for (var i = 10; i >= 0; i--) {
            ReactTestUtils.Simulate.click(rendered);
        };

        expect(callback.calledOnce).toEqual(true);
    });

    it('should allow clicking it after the callback returns the call', function() {
        var callback = sinon.spy();
        var component = ReactTestUtils.renderIntoDocument(
            <ConfirmActionButton callback={callback} />);
        var rendered = ReactDOM.findDOMNode(component);

        ReactTestUtils.Simulate.click(rendered);
        ReactTestUtils.Simulate.click(rendered);

        var recallback = callback.getCall(0).args[0];
        recallback(true);
        callback.reset();

        ReactTestUtils.Simulate.click(rendered);
        expect(callback.called).toEqual(false);
        ReactTestUtils.Simulate.click(rendered);
        expect(callback.called).toEqual(true);
    });
});
