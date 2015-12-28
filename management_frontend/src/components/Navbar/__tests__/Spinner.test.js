/*jshint ignore:start */
'use strict';

describe('Spinner', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var _ = require('lodash');
    var rewire = require('rewire');

    var _Spinner, Spinner;

    beforeEach(function() {
        _Spinner = rewire('../Spinner');
        Spinner = _Spinner.Spinner;
    });

    it('should render without any outside influence', function() {
        var Renderer = ReactTestUtils.createRenderer();
        Renderer.render(<Spinner />);
        var rendered = Renderer.getRenderOutput();

        expect(rendered).toBeDefined();
        expect(rendered.type).toEqual('a');
    });

    it('should register itself as RPC for "spinner.start" and "spinner.stop" methods', function() {
        var rp = rewire('../../../rp');
        _Spinner.__set__('rp', rp);

        // var Renderer = ReactTestUtils.createRenderer();
        // Renderer.render(<Spinner />);
        // var rendered = Renderer.getRenderOutput();
        var component = ReactTestUtils.renderIntoDocument(<Spinner />);

        expect(rp.rpc.isRegistered('spinner.start')).toEqual(true);
        expect(rp.rpc.isRegistered('spinner.stop')).toEqual(true);
    });

    it('should instantiate Spin, call .spin and .stop on it', function() {
        var Spin = function() { };
        Spin.prototype.spin = function() { };
        Spin.prototype.stop = function() { };

        var spinMethod = sinon.spy(Spin.prototype, 'spin');
        var stopMethod = sinon.spy(Spin.prototype, 'stop');

        _Spinner.__set__('Spin', Spin);

        var rp = rewire('../../../rp');
        _Spinner.__set__('rp', rp);

        var component = ReactTestUtils.renderIntoDocument(<Spinner />);

        rp.rpc.call('spinner.start');
        expect(spinMethod.calledOnce).toEqual(true);

        rp.rpc.call('spinner.stop');
        expect(stopMethod.calledOnce).toEqual(true);
    });

    it('should act like a semaphore on multiple spinner.start or spinner.stop calls', function() {
        var Spin = function() { };
        Spin.prototype.spin = function() { };
        Spin.prototype.stop = function() { };

        var spinMethod = sinon.spy(Spin.prototype, 'spin');
        var stopMethod = sinon.spy(Spin.prototype, 'stop');

        _Spinner.__set__('Spin', Spin);

        var rp = rewire('../../../rp');
        _Spinner.__set__('rp', rp);

        var component = ReactTestUtils.renderIntoDocument(<Spinner />);

        _.times(5, function() {
            rp.rpc.call('spinner.start');
        });
        expect(spinMethod.calledOnce).toEqual(true);

        rp.rpc.call('spinner.stop');
        expect(stopMethod.calledOnce).toEqual(false);
        _.times(4, function() {
            rp.rpc.call('spinner.stop');
        });
        expect(stopMethod.calledOnce).toEqual(true);
    });
});
