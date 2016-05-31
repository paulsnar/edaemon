'use strict';

export function isValidISO8601(str) {
    if (str === '') return false;
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (!regex.test(str)) return false;
    let [_, year, month, day] = regex.exec(str).map(
        (v,i) => i !== 0 ? parseInt(v,10) : null);
    if ((1 > month || 12 < month) || (1 > day || 31 < day)) return false;

    return true;
}
