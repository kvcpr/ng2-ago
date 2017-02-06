import { Pipe, PipeTransform, Inject, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NumberWrapper } from '@angular/common/src/facade/lang';
import { DateFormatter } from '@angular/common/src/pipes/intl';
import { InvalidPipeArgumentError } from '@angular/common/src/pipes/invalid_pipe_argument_error';
import {Observable} from 'rxjs/Observable';
const ISO8601_DATE_REGEX =
    /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
//    1        2       3         4          5          6          7          8  9     10      11

@Pipe({
    name: 'ago'
})
export class TimeAgoPipe implements PipeTransform {

    static _ALIASES: {[key: string]: string} = {
        'medium': 'yMMMdjms',
        'short': 'yMdjm',
        'fullDate': 'yMMMMEEEEd',
        'longDate': 'yMMMMd',
        'mediumDate': 'yMMMd',
        'shortDate': 'yMd',
        'mediumTime': 'jms',
        'shortTime': 'jm'
    };
    static _PERIOD: {[key: string]: number} = {
        second: 1000,
        minute: 60000,
        hour:   3600000,
        day:    86400000,
        week:   604800000,
        month:  2592000000,
        year:   31536000000
    };
    maxPeriod: number;
    dateFormat: string;

    /** @constructor **/
    constructor(@Inject(LOCALE_ID) private _locale: string) {
    }

    /**
     *
     * @param date
     * @returns {string}
     */
    getTimeAgo(date: any) {
        let difference = new Date().getTime() - new Date(date).getTime();
        if (difference > this.maxPeriod) {
            if (typeof date === 'string') {
                date = date.trim();
            }
            if (isDate(date)) {
            } else if (NumberWrapper.isNumeric(date)) {
                date = new Date(parseFloat(date));
            } else if (typeof date === 'string' && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(date)) {
                const [y, m, d] = date.split('-').map((val: string) => parseInt(val, 10));
                date = new Date(y, m - 1, d);
            } else {
                date = new Date(date);
            }
            if (!isDate(date)) {
                let match: RegExpMatchArray;
                if ((typeof date === 'string') && (match = date.match(ISO8601_DATE_REGEX))) {
                    date = isoStringToDate(match);
                } else {
                    throw new InvalidPipeArgumentError(TimeAgoPipe, date);
                }
            }
            return DateFormatter.format(date, this._locale, TimeAgoPipe._ALIASES[this.dateFormat] || this.dateFormat);
        } else {
            let unitHelper = 'second';
            let unit;
            for (unit in TimeAgoPipe._PERIOD) {
                if (difference < TimeAgoPipe._PERIOD[unit]) {
                    return this.makeupStr(unitHelper, Math.round(difference / (TimeAgoPipe._PERIOD[unitHelper])));
                }
                unitHelper = unit;
            }
            return this.makeupStr(unit, Math.round(difference / TimeAgoPipe._PERIOD[unitHelper]))
        }
    }

    /**
     *
     * @param unit
     * @param n
     * @returns {string}
     */
    makeupStr(unit: string, n: number){
        return n + ' ' + unit + (n != 1 ? 's' : '') + ' ' + 'ago'
    }

    /**
     *
     * @param date
     * @param maxPeriod
     * @param dateFormat
     * @returns {string}
     */
    transform(date: any,
              /*live: boolean = true,
               interval: number = 6000,*/
              maxPeriod: number = 86400000,
              dateFormat: string = 'medium') {
        this.maxPeriod = maxPeriod;
        this.dateFormat = dateFormat;
        return this.getTimeAgo(date)
    }
}
function isDate(obj: any): obj is Date {
    return obj instanceof Date && !isNaN(obj.valueOf());
}
function isoStringToDate(match: RegExpMatchArray): Date {
    const date = new Date(0);
    let tzHour = 0;
    let tzMin = 0;
    const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
    const timeSetter = match[8] ? date.setUTCHours : date.setHours;

    if (match[9]) {
        tzHour = toInt(match[9] + match[10]);
        tzMin = toInt(match[9] + match[11]);
    }
    dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
    const h = toInt(match[4] || '0') - tzHour;
    const m = toInt(match[5] || '0') - tzMin;
    const s = toInt(match[6] || '0');
    const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
    timeSetter.call(date, h, m, s, ms);
    return date;
}
function toInt(str: string): number {
    return parseInt(str, 10);
}
