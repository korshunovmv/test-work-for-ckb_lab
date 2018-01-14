import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateToString' })
export class DateToStringPipe implements PipeTransform {

  transform(value: any, format: string, local: boolean = true, unix: boolean = false) {
    if (value === null) {
      return null;
    }
    if (!format) {
      format = 'LLL';
    }
    if (format === 'fromNow') {
      if (unix) {
        return moment.unix(value).fromNow();
      } else if (local) {
        return moment(value).fromNow();
      } else {
        return moment.utc(value).fromNow();
      }
    }
    let result: string;
    if (unix) {
      result = moment.unix(value).format(format);
    } else if (local) {
      result = moment(value).format(format);
    } else {
      result = moment.utc(value).format(format);
    }
    if (result === 'Invalid date') {
      return '---';
    } else {
      return result;
    }
  }
}
