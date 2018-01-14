import * as moment from 'moment';

export class Issue {
  id: string;
  title: string;
  description: string;
  dateEnd: moment.Moment;
  sort: number;
  closed: boolean;
}
