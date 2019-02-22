import { AppConfigProvider } from '../app-config/app-config';
import { Injectable } from '@angular/core';
import { isNil } from 'lodash';

@Injectable()
export class UrlProvider {

  constructor(
    public appConfigProvider: AppConfigProvider,
  ) {}
  /**
   * @param  {string} staffNumber
   * @returns any
   */
  getPersonalJournalUrl(staffNumber: string): any {
    const urlTemplate = this.appConfigProvider.getAppConfig().journal.journalUrl;
    return urlTemplate.replace('{staffNumber}', isNil(staffNumber) ? '00000000' : staffNumber);
  }
  /**
   * @returns any
   */
  getLoggingServiceUrl(): any {
    return this.appConfigProvider.getAppConfig().loggingUrl;
  }

}
