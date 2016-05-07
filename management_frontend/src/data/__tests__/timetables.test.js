/*jshint ignore:start */
'use strict';

describe('Data.timetables', function() {
    var rewire = require('rewire');
    var data, fetch, status, ret_json, last_url, last_options;

    beforeEach(function() {
        data = rewire('../index');
        data.__set__('fetch', function fetch(url, options) {
            last_url = url;
            last_options = options;
            return new Promise(res => {
                res({
                    status: status,
                    statusText: 'Dummy status text',
                    json: () => {
                        return new Promise(_res => _res(ret_json));
                    }
                });
            });
        });
    });

    it('should not allow .getForClass with empty class name', function(done) {
        status = 200;
        ret_json = { dummy: 'json' };

        data.timetables.getForClass().then(() => {
            done.fail('.getForClass allowed empty class name');
        }).catch(() => done());
    });

    it('should make a request without a cursor when .getAll is not given a cursor', function() {
        status = 200;
        ret_json = { dummy: 'json' };

        data.timetables.getAll();

        expect(last_url).not.toMatch(/\?cursor=(.*)$/);
    });

    it('should make a request with a cursor when .getAll is given a cursor', function() {
        status = 200;
        ret_json = { dummy: 'json' };

        var cursor = 'dummy_cursor_21424';

        data.timetables.getAll(cursor);

        expect(last_url).toMatch('\\?cursor=' + cursor + '$');
    });

    it('should fail when .getForClass receives a non-200 response', function(done) {
        status = 400;
        ret_json = { dummy: 'json' };

        data.timetables.getForClass('nil').then(() => {
            done.fail('.getForClass didn\'t fail on non-200 response');
        }).catch(err => { done(); });
    });
    it('should fail when .getAll receives a non-200 response', function(done) {
        status = 400;
        ret_json = { dummy: 'json' };

        data.timetables.getAll().then(() => {
            done.fail('.getAll didn\'t fail on non-200 response');
        }).catch(err => { done(); });
    });

    it('should submit the data of .input verbatim as JSON', function(done) {
        status = 200;
        ret_json = { dummy: 'json' };

        var submit = { dummy: 'json', moar: ['dummy', 'json'] };

        data.timetables.input(submit).then(ret => {
            expect(JSON.parse(last_options.body)).toEqual(submit);
            expect(last_options.headers['Content-Type']).toEqual('application/json');
            done();
        }).catch(err => done.fail(err));
    });
});
