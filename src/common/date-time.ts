import * as moment from 'moment';

export class DateTime {
  moment: moment.Moment;

  constructor(sourceDateTime?: DateTime | string | Date) {
    if (sourceDateTime === undefined) {
      this.moment = moment();
    } else if (typeof sourceDateTime === 'string' || sourceDateTime instanceof Date) {
      this.moment = moment(sourceDateTime);
    } else {
      this.moment = moment(sourceDateTime.moment);
    }
  }
  /**
   * @returns DateTime
   */
  static now(): DateTime {
    return new DateTime();
  }
  /**
   * @param  {DateTime|string|Date} sourceDateTime
   * @returns DateTime
   */
  static at(sourceDateTime: DateTime | string | Date): DateTime {
    return new DateTime(sourceDateTime);
  }

  /**
   * @param  {number} amount
   * @param  {Duration} unit
   * @returns DateTime
   */
  add(amount: number, unit: Duration): DateTime {
    const momentUnit = unit.valueOf() as moment.unitOfTime.DurationConstructor;
    this.moment.add(amount, momentUnit);
    return this;
  }

  /**
   * @param  {number} amount
   * @param  {Duration} unit
   * @returns DateTime
   */
  subtract(amount: number, unit: Duration): DateTime {
    const momentUnit = unit.valueOf() as moment.unitOfTime.DurationConstructor;
    this.moment.subtract(amount, momentUnit);
    return this;
  }
  /**
   * @param  {string} formatString
   * @returns string
   */
  format(formatString: string): string {
    return this.moment.format(formatString);
  }
  /**
   * @returns number
   */
  day(): number {
    return this.moment.day();
  }
  /**
   * @returns string
   */
  toString(): string {
    return this.moment.toString();
  }
  /**
   * @param  {DateTime|string|Date} targetDate
   * @returns number
   */
  daysDiff(targetDate: DateTime | string | Date): number {
    const date = new DateTime(targetDate);
    const today = this.moment.startOf(Duration.DAY);
    return date.moment.startOf(Duration.DAY).diff(today, Duration.DAY);
  }
}

export enum Duration {
  DAY    = 'day',
  HOUR   = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
}
