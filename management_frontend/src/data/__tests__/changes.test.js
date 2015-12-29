/*jshint ignore:start */
'use strict';

describe('Data.changes', function() {
    var rewire = require('rewire');
    var data, fetch, status, ret_json, last_url, last_options;

    beforeAll(function() {
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

    it('should return the expected JSON if status is acceptable', function(done) {
        status = 200;
        ret_json = { dummy: 'json' };

        data.changes.getAll().then(ret => {
            expect(ret).toEqual(ret_json);
            done();
        }).catch(err => done.fail(err));
    });

    it('should fail if .getWeek gets non-200 response', function(done) {
        status = 404;
        ret_json = { dummy: 'json' };

        // expect(data.changes.getAll).toThrow();
        data.changes.getWeek().then(() => done.fail()).catch(() => done());
    });
    it('should fail if .getAll gets non-200 response', function(done) {
        status = 404;
        ret_json = { dummy: 'json' };

        // expect(data.changes.getAll).toThrow();
        data.changes.getAll().then(() => done.fail()).catch(() => done());
    });

    it('should fail if .get gets non-200 response', function(done) {
        status = 404;
        ret_json = { dummy: 'json' };

        data.changes.get('1').then(() => done.fail()).catch(() => done());
        // data.changes.get('1').then(ret => {
        //     expect(ret).toEqual(ret_json);
        //     done();
        // }).catch(err => done.fail(err));
    });
    it('should ignore non-200 responses with .delete', function(done) {
        status = 404;
        ret_json = { dummy: 'json' };

        data.changes.delete('1').then(ret => {
            expect(ret).toEqual(ret_json);
            done();
        }).catch(err => done.fail(err));
    });

    it('should not allow empty ids when using .get, instead failing the promise',
    function(done) {
        status = 200;
        ret_json = { dummy: 'json' };

        data.changes.get('').then(() => {
            done.fail('.get allowed empty id');
        }).catch(err => done(err));
    });
    it('should not allow empty ids when using .delete, instead failing the promise',
    function(done) {
        status = 200;
        ret_json = { dummy: 'json' };

        data.changes.delete('').then(() => {
            done.fail('.delete allowed empty id');
        }).catch(err => done(err));
    });

    it('should submit the data of .input verbatim as JSON', done => {
        status = 200;
        ret_json = { dummy: 'json' };

        var submit = { dummy: 'json', moar: ['dummy', 'json'] };

        data.changes.input(submit).then(ret => {
            expect(JSON.parse(last_options.body)).toEqual(submit);
            expect(last_options.headers['Content-Type']).toEqual('application/json');
            done();
        }).catch(err => done.fail(err));
    });
});
