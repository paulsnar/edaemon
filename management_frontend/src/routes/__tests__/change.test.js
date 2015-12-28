/*jshint ignore:start */
'use strict';

describe('route: /changes/:id', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var mock = {
        change: {
            id: 'test_id_1000',
            for_class: '1.0',
            for_date: '2015-12-12',
            lessons: [
                'lesson $',
                'lesson $',
                'Lesson 2',
                'lesson $',
                'lesson $',
                'Lesson 5'
            ]
        },
        Data: {
            changes: {
                get: function() {
                    return new Promise(res => res({ change: mock.change }));
                }
            }
        },
        rp: {
            rpc: {
                call: function() { }
            }
        }
    };

    var ChangeHandler, change;

    beforeEach(function() {
        change = rewire('../change');
        ChangeHandler = change.ChangeHandler;
    });

    it('should render when loaded', function() {
        change.__set__('rp', mock.rp);
        change.__set__('Data', mock.Data);

        var page = ReactTestUtils.renderIntoDocument(<ChangeHandler
            params={{ id: mock.change.id }} />);
        var domNode = ReactDOM.findDOMNode(page);

        expect(page).toBeDefined();
        expect(domNode.tagName.toLowerCase()).toEqual('div');
    });

    it('should call the spinner RPCs while loading', function(done) {
        var rp = {
            rpc: {
                call: function() { }
            }
        };
        var spy = sinon.spy(rp.rpc, 'call');
        change.__set__('rp', rp);
        change.__set__('Data', mock.Data);

        var page = ReactTestUtils.renderIntoDocument(<ChangeHandler
            params={{ id: mock.change.id }} />);

        setTimeout(function() {
            // let the promise stuff settle
            expect(spy.withArgs('spinner.start').callCount).toBeGreaterThan(0);
            expect(spy.withArgs('spinner.stop').callCount).toBeGreaterThan(0);
            expect(spy.withArgs('spinner.start').callCount).toEqual(
                spy.withArgs('spinner.stop').callCount);

            done();
        }, 100);
    });
});
