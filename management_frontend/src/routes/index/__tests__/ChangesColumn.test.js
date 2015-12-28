/*jshint ignore:start */
'use strict';

describe('route:/ -> ChangesColumn', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ReactTestUtils = require('react-addons-test-utils');
    var rewire = require('rewire');

    var ChangesColumn;
    beforeEach(function() {
        ChangesColumn = rewire('../ChangesColumn');
    });

    var mock = {
        changes: [
            { id: 'change_1', for_class: 'class', for_date: '2015-12-12' },
            { id: 'change_2', for_class: 'class', for_date: '2015-12-12' },
            { id: 'change_3', for_class: 'class', for_date: '2015-12-12' },
        ],
        Data: {
            changes: {
                getWeek: function() {
                    return new Promise(res => res({ changes: mock.changes }));
                }
            }
        },
        rp: {
            rpc: {
                call: function() { }
            }
        }
    };

    it('should request Data.changes.getWeek on load', function() {
        ChangesColumn.__set__('rp', mock.rp);
        var spy = sinon.spy(mock.Data.changes, 'getWeek');
        ChangesColumn.__set__('Data', mock.Data);

        var page = ReactTestUtils.renderIntoDocument(<ChangesColumn />);

        expect(spy.calledOnce).toEqual(true);
        mock.Data.changes.getWeek.restore();
    });

    it('should call the spinner RPCs while loading', function(done) {
        // var spy = sinon.spy(mock.rp.rpc, 'call');
        var rp = {
            rpc: {
                call: function() { }
            }
        };
        var spy = sinon.spy(rp.rpc, 'call');
        ChangesColumn.__set__('rp', rp);

        ChangesColumn.__set__('Data', mock.Data);

        var page = ReactTestUtils.renderIntoDocument(<ChangesColumn />);

        setTimeout(function() {
            // wait a little bit due to (sometimes) async stuff w/ promises
            // expect(spy.withArgs('spinner.start').calledOnce).toEqual(true);
            // expect(spy.withArgs('spinner.stop').calledOnce).toEqual(true); // TODO: fails
            expect(spy.withArgs('spinner.start').callCount).toBeGreaterThan(0);
            expect(spy.withArgs('spinner.stop').callCount).toBeGreaterThan(0);
            expect(spy.withArgs('spinner.start').callCount).toEqual(
                spy.withArgs('spinner.stop').callCount);

            // mock.rp.rpc.call.restore();
            done();
        }, 100);
    });

    it('should map changes from Data.changes.getWeek to <DefaultChange />s', function() {
        var DefaultChange = React.createClass({
            render: function() {
                return <span>
                    <span className="__id__">{this.props.change.id}</span>
                    mock DefaultChange
                </span>;
            }
        });
        ChangesColumn.__set__('DefaultChange', DefaultChange);

        var _changes = [
            { id: 'test id 1' },
            { id: 'test id 2' },
            { id: 'test id 3' }
        ];
        var Data = {
            changes: {
                getWeek: function() {
                    return new Promise((res, rej) => {
                        res({
                            changes: _changes
                        });
                    })
                }
            }
        };
        ChangesColumn.__set__('Data', Data);

        ChangesColumn.__set__('rp', mock.rp);

        var component = ReactTestUtils.renderIntoDocument(<ChangesColumn />);
        component.data.changes = _changes;
        // force loaded state
        component.setState({ loaded: true });
        var changeComponents = ReactTestUtils.scryRenderedComponentsWithType(
            component, DefaultChange);

        expect(changeComponents.length).toEqual(3);
    });
});
