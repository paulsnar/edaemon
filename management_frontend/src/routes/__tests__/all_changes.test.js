/*jshint ignore:start */
'use strict';

describe('route: /changes/all', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    function generateChanges() {
        var changes = [ ];
        for (var i = 0; i < 3; i++) {
            var change = { for_class: '1.0random', for_date: '2015-12-12' };
            change.id = 'random_id_' + Math.floor(Math.random() * 1500);
            changes.push(change);
        };
        return changes;
    }

    var mock = {
        changes: [
            { id: 'test_id_1000', for_class: '1.0', for_date: '2015-12-12' },
            { id: 'test_id_1001', for_class: '1.0', for_date: '2015-12-12' },
            { id: 'test_id_1002', for_class: '1.0', for_date: '2015-12-12' },
        ],
        Data: {
            changes: {
                getAll: function() {
                    return new Promise(res => res({
                        changes: mock.changes
                    }));
                }
            }
        },
        rp: {
            rpc: {
                call: function() { }
            }
        }
    };

    var AllChangesHandler, all_changes;

    beforeEach(function() {
        all_changes = rewire('../all_changes');
        AllChangesHandler = all_changes.AllChangesHandler;
    });

    it('should render fine without any router passed params', function() {
        all_changes.__set__('Data', mock.Data);
        all_changes.__set__('rp', mock.rp);

        var page = ReactTestUtils.renderIntoDocument(<AllChangesHandler />);
        var domElement = ReactDOM.findDOMNode(page);

        expect(page).toBeDefined();
        expect(domElement.tagName.toLowerCase()).toEqual('div');
    });

    it('should call Data.changes.getAll on load', function() {
        var Data = {
            changes: {
                getAll: function() { return mock.Data.changes.getAll(); }
            }
        };
        var spy = sinon.spy(Data.changes, 'getAll');
        all_changes.__set__('Data', Data);
        all_changes.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<AllChangesHandler />);

        expect(spy.called).toEqual(true);
    });

    it('should display a "show more" button when response has a cursor, and on click request with cursor in query', function() {
        var cursor = 'cursor_12345_test01';
        var Data = {
            changes: {
                getAll: function(c) {
                    if (c) {
                        return new Promise(res => res({ changes: generateChanges() }));
                    } else {
                        return new Promise(res => res({ changes: mock.changes, cursor: cursor }));
                    }
                }
            }
        };
        var spy = sinon.spy(Data.changes, 'getAll');
        all_changes.__set__('Data', Data);
        all_changes.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<AllChangesHandler />);
        expect(spy.called).toEqual(true);
        // force load
        component.data.changes = mock.changes;
        component.setState({ loaded: true, cursor: cursor });
        var loadMoreButton = ReactTestUtils.findRenderedDOMComponentWithClass(
            component, 'glyphicon glyphicon-asterisk');
        var loadMoreDomNode = ReactDOM.findDOMNode(loadMoreButton);
        ReactTestUtils.Simulate.click(loadMoreDomNode);

        expect(spy.withArgs(cursor).called).toEqual(true);
    });

    it('should call spinner RPCs while loading', function(done) {
        var rp = {
            rpc: {
                call: function() { }
            }
        };
        var spy = sinon.spy(rp.rpc, 'call');
        all_changes.__set__('rp', rp);
        all_changes.__set__('Data', mock.Data);

        var component = ReactTestUtils.renderIntoDocument(<AllChangesHandler />);

        setTimeout(function() {
            // settle promises etc
            expect(spy.withArgs('spinner.start').callCount).toBeGreaterThan(0);
            expect(spy.withArgs('spinner.stop').callCount).toBeGreaterThan(0);
            expect(spy.withArgs('spinner.start').callCount).toEqual(
                spy.withArgs('spinner.stop').callCount);

            done();
        }, 100);
    });

    it('should map received changes to <DefaultChange />s', function() {
        var DefaultChange = React.createClass({
            render: function() {
                return <span>dummy</span>;
            }
        });
        all_changes.__set__('DefaultChange', DefaultChange);

        var _changes = generateChanges();
        var Data = {
            changes: {
                getAll: function() {
                    return new Promise(res => res({ changes: _changes }));
                }
            }
        };
        all_changes.__set__('Data', Data);

        all_changes.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<AllChangesHandler />);
        // force load
        component.data.changes = _changes;
        component.setState({ loaded: true, cursor: null });

        var changeComponents = ReactTestUtils.scryRenderedComponentsWithType(
            component, DefaultChange);

        expect(changeComponents.length).toEqual(3);
    })
});
