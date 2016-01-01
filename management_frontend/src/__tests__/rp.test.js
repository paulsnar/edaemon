/*jshint ignore:start */
'use strict';

describe('rp', function() {
    var rewire = require('rewire');

    describe('rp.events', function() {
        var rp;

        beforeEach(function() {
            rp = rewire('../rp');
        });

        it('should call subscribers once asked to', function() {
            var eventName = 'test event 1';
            var spy = sinon.spy();

            rp.events.subscribe(eventName, spy);
            rp.events.publish(eventName);

            expect(spy.called).toEqual(true);
        });

        it('should call the callback with the arguments', function() {
            var eventName = 'test event 2';
            var args = [1, 2, 3, 4];
            var spy = sinon.spy();

            rp.events.subscribe(eventName, spy);
            rp.events.publish.apply(rp.events, [eventName].concat(args));

            expect(spy.called).toEqual(true);
            expect(spy.calledWith.apply(spy, args)).toEqual(true);

            eventName = 'test event 3';
            spy = sinon.spy();
            var arg = 42;

            rp.events.subscribe(eventName, spy);
            rp.events.publish(eventName, arg);

            expect(spy.called).toEqual(true);
            expect(spy.calledWith(arg)).toEqual(true);
        });

        it('should remove the callback after unsubscribing', function() {
            var eventName = 'test event 4';
            var arg = 42;
            var spy = sinon.spy();

            rp.events.subscribe(eventName, spy);
            rp.events.publish(eventName, arg);
            rp.events.unsubscribe(eventName, spy);
            rp.events.publish(eventName, arg);

            expect(spy.withArgs(arg).calledOnce).toEqual(true);
        });

        it('should call .once-subscribed callbacks only once', function() {
            var eventName = 'test event 5';
            var arg = 42;
            var spy = sinon.spy();

            rp.events.once(eventName, spy);
            rp.events.publish(eventName, arg);
            rp.events.publish(eventName, arg);

            expect(spy.withArgs(arg).calledOnce).toEqual(true);
        });

        it('should let know of subscribers to a specific event', function() {
            var eventName = 'test event 6';

            rp.events.subscribe(eventName, function() { });
            rp.events.subscribe(eventName, function() { });
            rp.events.once(eventName, function() { });
            rp.events.once(eventName, function() { });

            expect(rp.events.subscribers(eventName)).toEqual(4);
        });
    });

    describe('rp.rpc', function() {
        var rp;

        beforeEach(function() {
            rp = rewire('../rp');
        });

        it('should call registered RPCs', function() {
            var name = 'test rpc 1';
            var spy = sinon.spy();

            rp.rpc.register(name, spy);
            rp.rpc.call(name);

            expect(spy.called).toEqual(true);
        });

        it('should call registered RPCs with supplied args', function() {
            var name = 'test rpc 2';
            var spy = sinon.spy();
            var arg1 = 42;
            var arg2 = { dummy: 'object' };
            var arg3 = [42, 42, 42];

            rp.rpc.register(name, spy);
            rp.rpc.call(name, arg1, arg2, arg3);

            expect(spy.withArgs(arg1, arg2, arg3).called).toEqual(true);
        });

        it('should return whether an RPC is registered', function() {
            var name = 'test rpc 3';

            rp.rpc.register(name, () => { });

            expect(rp.rpc.isRegistered(name)).toEqual(true);
        });

        it('should throw if attempted to call an undefined RPC', function() {
            var name = 'test rpc 4';

            expect(rp.rpc.call.bind(rp.rpc, name, null)).toThrowError(
                'Attempted to call a nonexistant RPC');
        });

        it('should allow unregistering RPCs and throwing if called after unregistering', function() {
            var name = 'test rpc 5';
            var spy = sinon.spy();

            rp.rpc.register(name, spy);
            rp.rpc.call(name, null);
            rp.rpc.unregister(name);

            expect(spy.calledOnce).toEqual(true);
            expect(rp.rpc.call.bind(rp.rpc, name, null)).toThrowError(
                'Attempted to call a nonexistant RPC');
        });
    });
});
