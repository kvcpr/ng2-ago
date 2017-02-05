import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ago'
})

export class CurrencyPipe implements PipeTransform {

    timer: any;

    constructor() {}

    transform(date: Date, live: boolean = true, interval: number = 60000) {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }
}