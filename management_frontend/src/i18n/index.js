/*jshint -W097 */
'use strict';

var _ = require('lodash');

function formatMonth(month, form) {
    form = form || 'nominativs';
    switch (form) {
        case 'nominativs':
        switch (month) {
            case  1: return 'janvāris';
            case  2: return 'februāris';
            case  3: return 'marts';
            case  4: return 'aprīlis';
            case  5: return 'maijs';
            case  6: return 'jūnijs';
            case  7: return 'jūlijs';
            case  8: return 'augusts';
            case  9: return 'septembris';
            case 10: return 'oktobris';
            case 11: return 'novembris';
            case 12: return 'decembris';
        }
        break;

        case 'genitivs':
        switch (month) {
            case  1: return 'janvāra';
            case  2: return 'februāra';
            case  3: return 'marta';
            case  4: return 'aprīļa';
            case  5: return 'maija';
            case  6: return 'jūnija';
            case  7: return 'jūlija';
            case  8: return 'augusta';
            case  9: return 'septembra';
            case 10: return 'oktobra';
            case 11: return 'novembra';
            case 12: return 'decembra';
        }
        break;

        case 'dativs':
        switch (month) {
            case  1: return 'janvārim';
            case  2: return 'februārim';
            case  3: return 'martam';
            case  4: return 'aprīlim';
            case  5: return 'maijam';
            case  6: return 'jūnijam';
            case  7: return 'jūlijam';
            case  8: return 'augustam';
            case  9: return 'septembrim';
            case 10: return 'oktobrim';
            case 11: return 'novembrim';
            case 12: return 'decembrim';
        }
        break;

        case 'akuzativs':
        switch (month) {
            case  1: return 'janvāri';
            case  2: return 'februāri';
            case  3: return 'martu';
            case  4: return 'aprīli';
            case  5: return 'maiju';
            case  6: return 'jūniju';
            case  7: return 'jūliju';
            case  8: return 'augustu';
            case  9: return 'septembri';
            case 10: return 'oktobri';
            case 11: return 'novembri';
            case 12: return 'decembri';
        }
        break;

        case 'instrumentalis':
        switch (month) {
            case  1: return 'ar janvāri';
            case  2: return 'ar februāri';
            case  3: return 'ar martu';
            case  4: return 'ar aprīli';
            case  5: return 'ar maiju';
            case  6: return 'ar jūniju';
            case  7: return 'ar jūliju';
            case  8: return 'ar augustu';
            case  9: return 'ar septembri';
            case 10: return 'ar oktobri';
            case 11: return 'ar novembri';
            case 12: return 'ar decembri';
        }
        break;

        case 'lokativs':
        switch (month) {
            case  1: return 'janvārī';
            case  2: return 'februārī';
            case  3: return 'martā';
            case  4: return 'aprīlī';
            case  5: return 'maijā';
            case  6: return 'jūnijā';
            case  7: return 'jūlijā';
            case  8: return 'augustā';
            case  9: return 'septembrī';
            case 10: return 'oktobrī';
            case 11: return 'novembrī';
            case 12: return 'decembrī';
        }
        break;

        case 'vokativs':
        switch (month) {
            case  1: return 'janvāri';
            case  2: return 'februāri';
            case  3: return 'mart';
            case  4: return 'aprīli';
            case  5: return 'maij';
            case  6: return 'jūnij';
            case  7: return 'jūlij';
            case  8: return 'august';
            case  9: return 'septembri';
            case 10: return 'oktobri';
            case 11: return 'novembri';
            case 12: return 'decembri';
        }
        break;
    }
}

function formatDate(ISO8601_string, form) {
    form = form || 'nominativs';
    var allowedForms = ['nominativs', 'genitivs', 'dativs', 'akuzativs',
        'instrumentalis', 'lokativs', 'vokativs'];
    var split = ISO8601_string.split('-');
    if (split.length !== 3 || !_.includes(allowedForms, form)) {
        switch (form) {
            case     'nominativs': return 'nezināms datums';
            case       'genitivs': return 'nezināma datuma';
            case         'dativs': return 'nezināmam datumam';
            case      'akuzativs': return 'nezināmu datumu';
            case 'instrumentalis': return 'ar nezināmu datumu';
            case       'lokativs': return 'nezināmā datumā';
            case       'vokativs': return 'nezināmais datum';
            default:               return 'nezināms datums';
        }
    } else {
        // var [year, month, day] = split;
        var year = Number(split[0]);
        var month = Number(split[1]);
        var day = Number(split[2]);
        if (_.isNaN(year) || _.isNaN(month) || _.isNaN(day) ||
            month <= 0 || month > 12) {
            switch (form) {
                case     'nominativs': return 'nezināms datums';
                case       'genitivs': return 'nezināma datuma';
                case         'dativs': return 'nezināmam datumam';
                case      'akuzativs': return 'nezināmu datumu';
                case 'instrumentalis': return 'ar nezināmu datumu';
                case       'lokativs': return 'nezināmā datumā';
                case       'vokativs': return 'nezināmais datum';
                default:               return 'nezināms datums';
            }
        } else {
            /*jshint -W119 */
            return `${year}.gada ${day}.${formatMonth(Number(month), form)}`;
            /*jshint +W119 */
        }
    }
}

module.exports = { formatMonth: formatMonth, formatDate: formatDate };
