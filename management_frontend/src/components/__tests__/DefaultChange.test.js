/*jshint ignore:start */
'use strict';

describe('DefaultChange', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var DefaultChange;
    var change = {
        id: '12345678901234567890',
        for_class: 'dummy class',
        for_date: '2015-12-01'
    };

    beforeEach(function() {
        DefaultChange = rewire('../DefaultChange');
    });

    it('should render when passed a Change object', function() {
        var Renderer = ReactTestUtils.createRenderer();
        Renderer.render(<DefaultChange change={change} />);
        var rendered = Renderer.getRenderOutput();

        expect(rendered).toBeDefined();
        expect(rendered.type).toEqual('span');
    });

    it('should call removeCallback once the ConfirmActionButton is clicked twice', function(done) {
        DefaultChange.__set__('Data', {
            changes: {
                delete: function(id) {
                    return new Promise((res, rej) => {
                        res({ success: true });
                    });
                }
            }
        });
        var component = ReactTestUtils.renderIntoDocument(
            <DefaultChange change={change} removeCallback={done} />);
        // var rendered = ReactDOM.findDOMNode(component);
        // var confirmActionButton = rendered.children[0];
        var confirmActionButton = ReactTestUtils.findRenderedDOMComponentWithTag(
            component, 'button');

        ReactTestUtils.Simulate.click(confirmActionButton);
        ReactTestUtils.Simulate.click(confirmActionButton);
    });
});
