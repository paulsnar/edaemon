/*jshint ignore:start */
'use strict';

describe('route: /changes/:id/edit', function() {
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
                'lesson $',
                'lesson $',
                'lesson $',
                'lesson $'
            ]
        },
        Data: {
            changes: {
                get: function() {
                    return new Promise(res => res({ change: mock.change }));
                }
                // not mocking .edit here
            }
        },
        rp: {
            rpc: {
                call: function() { }
            }
        }
    };

    var EditChangeHandler;

    beforeEach(function() {
        EditChangeHandler = rewire('../edit_change');
    });

    it('should render when loaded', function() {
        EditChangeHandler.__set__('rp', mock.rp);
        EditChangeHandler.__set__('Data', mock.Data);

        var page = ReactTestUtils.renderIntoDocument(<EditChangeHandler
            params={{ id: mock.change.id }} />);
        var domNode = ReactDOM.findDOMNode(page);

        expect(domNode.tagName.toLowerCase()).toEqual('div');
    });

    it('should call the spinner RPCs while loading', function(done) {
        var rp = {
            rpc: {
                call: function() { }
            }
        };
        var spy = sinon.spy(rp.rpc, 'call');
        EditChangeHandler.__set__('rp', rp);
        EditChangeHandler.__set__('Data', mock.Data);

        var component = ReactTestUtils.renderIntoDocument(<EditChangeHandler
            params={{ id: mock.change.id }} />);

        setTimeout(function() {
            expect(spy.withArgs('spinner.start').callCount).toEqual(
                spy.withArgs('spinner.stop').callCount);

            done();
        }, 100);
    });

    it('should not submit until all the required fiels (date and classname) are filled out', function() {
        var _precondition = false;
        var Data = {
            changes: {
                get: function() { return mock.Data.changes.get(); },
                edit: function(id) {
                    return new Promise(res => {
                        if (!_precondition) {
                            fail('Data.changes.edit was called while precondition wasn\'t met');
                        } else {
                            res({ success: true, id: mock.change.id });
                        }
                    })
                }
            }
        };
        var spy = sinon.spy(Data.changes, 'edit');
        EditChangeHandler.__set__('Data', Data);
        EditChangeHandler.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<EditChangeHandler
            params={{ id: mock.change.id }} />);
        // force load
        component.data.change = mock.change;
        component.setState({ loaded: true, date: mock.change.for_date });

        component.setState({ date: '' });
        component.save();
        expect(spy.called).toEqual(false);

        component.setState({ date: mock.change.for_date });
        component.setState({ className: '' });
        component.save();
        expect(spy.called).toEqual(false);

        component.setState({ className: mock.change.for_class });
        _precondition = true;
        component.save();
        expect(spy.called).toEqual(true);
    });

    it('should submit data according to format', function(done) {
        var Data = {
            changes: {
                get: function() { return mock.Data.changes.get(); },
                edit: function(id, data) {
                    expect(data.date).toBeDefined();
                    expect(data.className).toBeDefined();
                    expect(data.lessons).toBeDefined();
                    done();
                    return new Promise(res => res());
                }
            }
        };
        EditChangeHandler.__set__('Data', Data);
        EditChangeHandler.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<EditChangeHandler
            params={{ id: mock.change.id }} />);
        // force load
        component.data.change = mock.change;
        component.setState({ loaded: true, date: mock.change.for_date,
            className: mock.change.for_class });
        component.save();
    });
});
