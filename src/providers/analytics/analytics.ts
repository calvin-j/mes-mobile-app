import { Injectable } from '@angular/core';
import { AppConfigProvider } from '../app-config/app-config';
import { IAnalyticsProvider, AnalyticsEventCategories, AnalyticsDimensionIndices } from './analytics.model';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { DateTime } from '../../common/date-time';
import { createHash } from 'crypto';

@Injectable()
export class AnalyticsProvider implements IAnalyticsProvider {
  private analyticsStartupError: string = 'Error starting Google Analytics';
  googleAnalyticsKey: string;
  uniqueDeviceId: string;
  constructor(
    private appConfig: AppConfigProvider,
    public ga: GoogleAnalytics,
    public platform: Platform,
    private device: Device,
  ) { }
  /**
   * @returns Promise
   */
  initialiseAnalytics = (): Promise<any> =>
    new Promise((resolve) => {
      this.googleAnalyticsKey = this.appConfig.getAppConfig().googleAnalyticsId;
      this.platform.ready().then(() => {
        this.uniqueDeviceId = createHash('sha256')
          .update(this.device.uuid ? this.device.uuid : 'defaultDevice').digest('hex');
        this.setUserId(this.uniqueDeviceId);
        this.enableExceptionReporting();
      });
      resolve();
    })
  /**
   * @returns void
   */
  enableExceptionReporting():void {
    this.platform.ready().then(() => {
      this.ga
        .startTrackerWithId(this.googleAnalyticsKey)
        .then(() => {
          this.ga.enableUncaughtExceptionReporting(true)
          .then((resp) => {})
          .catch(uncaughtError => console.log('Error enabling uncaught exceptions', uncaughtError));
        })
        .catch(error => console.log(`enableExceptionReporting: ${this.analyticsStartupError}`, error));
    });
  }
  /**
   * @param  {string} name
   * @returns void
   */
  setCurrentPage(name: string):void {
    this.platform.ready().then(() => {
      this.ga
        .startTrackerWithId(this.googleAnalyticsKey)
        .then(() => {
          this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_ID, this.uniqueDeviceId);
          this.ga.trackView(name)
          .then((resp) => {})
          .catch(pageError => console.log('Error setting page', pageError));
        })
        .catch(error => console.log('Error starting Google Analytics', error));
    });
  }
  /**
   * @param  {string} category
   * @param  {string} event
   * @param  {string} label?
   * @param  {any} params?
   * @returns void
   */
  logEvent(category: string, event: string, label?: string, params?: any):void {
    this.platform.ready().then(() => {
      this.ga
        .startTrackerWithId(this.googleAnalyticsKey)
        .then(() => {
          this.ga.trackEvent(category, event, label)
          .then((resp) => {})
          .catch(eventError => console.log('Error tracking event', eventError));
        })
        .catch(error => console.log(`logEvent: ${this.analyticsStartupError}`, error));
    });
  }
  /**
   * @param  {number} key
   * @param  {string} value
   * @returns void
   */
  addCustomDimension(key: number, value: string):void {
    this.ga
    .startTrackerWithId(this.googleAnalyticsKey)
    .then(() => {
      this.ga.addCustomDimension(key, value)
        .then((resp) => {})
        .catch(dimError => console.log('Error adding custom dimension ', dimError));
    })
    .catch(error => console.log(`addCustomDimension: ${this.analyticsStartupError}`, error));
  }
  /**
   * @param  {string} type
   * @param  {string} message
   * @returns void
   */
  logError(type: string, message: string):void {
    this.logEvent(AnalyticsEventCategories.ERROR, type, message);
  }
  /**
   * @param  {string} message
   * @param  {boolean} fatal
   * @returns void
   */
  logException(message: string, fatal: boolean):void {
    this.ga
    .startTrackerWithId(this.googleAnalyticsKey)
    .then(() => {
      this.ga.trackException(message, fatal)
        .then((resp) => {})
        .catch(trackingError => console.log('Error logging exception in Google Analytics', trackingError));
    })
    .catch(error => console.log(`logException: ${this.analyticsStartupError}`, error));
  }
  /**
   * @param  {string} userId
   * @returns void
   */
  setUserId(userId: string):void {
    this.ga
    .startTrackerWithId(this.googleAnalyticsKey)
    .then(() => {
      this.ga.setUserId(userId)
        .then((resp) => {})
        .catch(idError => console.log(`Error setting userid ${userId}`, idError));
    })
    .catch(error => console.log(`setUserId: ${this.analyticsStartupError}`, error));
  }
  /**
   * @param  {string} userDate
   * @returns number
   */
  getDiffDays(userDate: string): number {
    const today = new DateTime();
    return today.daysDiff(userDate);
  }
  /**
   * @param  {string} userDate
   * @returns string
   */
  getDescriptiveDate(userDate: string): string {
    let ret: string;

    const daysDiff = this.getDiffDays(userDate);

    switch (daysDiff) {
      case -1 :
        ret = 'Yesterday';
        break;
      case 0:
        ret = 'Today';
        break;
      case 1:
        ret = 'Tomorrow';
        break;
      default:
        ret = userDate;
        break;
    }
    return ret;
  }
}
