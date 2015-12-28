'use strict';

var rewire = require('rewire');

describe('i18n', function() {
    var i18n;

    beforeAll(function() {
        i18n = rewire('../src/i18n');
    });

    it('should return month name in nominative when formatting without specifying form',
    () => {
        expect(i18n.formatMonth(1)).toEqual('janvāris');
        expect(i18n.formatMonth(7)).toEqual('jūlijs');
    });

    it('should return month name in specified form when asked to nicely', () => {
        expect(i18n.formatMonth(4, 'genitivs')).toEqual('aprīļa');
        expect(i18n.formatMonth(10, 'akuzativs')).toEqual('oktobri');
    });

    it('should return nothing when asked to format nonexisting month or to an undefined form',
    () => {
        expect(i18n.formatMonth(16)).not.toBeDefined();
        expect(i18n.formatMonth(4, 'deklinativs')).not.toBeDefined();
    });


    it('should format dates without a leading zero', () => {
        expect(i18n.formatDate('6-12-01')).toEqual('6.gada 1.decembris');
        expect(i18n.formatDate('2015-12-01')).toEqual('2015.gada 1.decembris');
        expect(i18n.formatDate('2015-12-11')).toEqual('2015.gada 11.decembris');
    })

    it('should format proper ISO8601-compliant dates to specified form', () => {
        expect(i18n.formatDate('2015-12-01', 'dativs')).toEqual('2015.gada 1.decembrim');
        expect(i18n.formatDate('2000-03-16', 'lokativs')).toEqual('2000.gada 16.martā');
    });

    it('should return "unknown date" when asked to format dates not complying to ISO8601, using the specified form',
    () => {
        expect(i18n.formatDate('03/04/2010')).toEqual('nezināms datums');
        expect(i18n.formatDate('2010.14.21', 'genitivs')).toEqual('nezināma datuma');
        expect(i18n.formatDate('garbageDate', 'akuzativs')).toEqual('nezināmu datumu');
    });

    it('should return nominative form dates when form is not specified', () => {
        expect(i18n.formatDate('2010-01-01')).toEqual('2010.gada 1.janvāris');
        expect(i18n.formatDate('2011-04-04')).toEqual('2011.gada 4.aprīlis');
    });

    it('should return "unknown date" in nominative when an undefined form is specified', () => {
        expect(i18n.formatDate('2015-12-01', 'deklinativs')).toEqual('nezināms datums');
    });

    it('should not accept invalid months, returning "unknown date" instead, in specified form', () => {
        expect(i18n.formatDate('2015-15-01')).toEqual('nezināms datums');
        expect(i18n.formatDate('2015-15-01', 'genitivs')).toEqual('nezināma datuma');
    });

});
