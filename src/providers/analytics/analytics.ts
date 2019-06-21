import { Injectable } from '@angular/core';
import { IAnalyticsProvider, AnalyticsEvents, AnalyticsParams } from './analytics.model';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { DateTime } from '../../shared/helpers/date-time';
import { createHash } from 'crypto';
import { DeviceProvider } from '../device/device';
import { AuthenticationProvider } from '../authentication/authentication';

@Injectable()
export class AnalyticsProvider implements IAnalyticsProvider {

  uniqueDeviceId: string;
  uniqueUserId: string;

  constructor(
    private firebase: Firebase,
    private platform: Platform,
    private device: DeviceProvider,
    private authProvider: AuthenticationProvider,
  ) { }

  public initialiseAnalytics(): void {
    console.log('==== initialiseAnalytics ====');
    this.setDeviceId();
    this.setUserId();
  }

  public setDeviceId(): void {
    this.platform.ready().then(() => {
      console.log('==== setDeviceId ====', this.device.getUniqueDeviceId());
      this.uniqueDeviceId = createHash('sha256')
        .update(this.device.getUniqueDeviceId() || 'defaultDevice').digest('hex');
      this.addUserProperty('device_id', this.uniqueDeviceId.slice(0, 36)); // max length of user property value is 36
    });
  }

  public setUserId(): void {
    this.platform.ready().then(() => {
      console.log('==== setUserId ====', this.authProvider.getEmployeeId());
      this.uniqueUserId = createHash('sha256').update(this.authProvider.getEmployeeId() || 'unavailable').digest('hex');
      this.addUserProperty('staff_number', this.uniqueUserId.slice(0, 36)); // max length of user property value is 36
      this.updateUserId(this.uniqueUserId);
      this.firebase.setCrashlyticsUserId(this.uniqueUserId);
    });
  }

  public setCurrentPage(name: string): void {
    this.platform.ready().then(() => {
      console.log('==== setCurrentPage ====', name);
      // manually track screen
      this.firebase.setScreenName(name);

      // no need to log 'screen_view' event like this
      // this.firebase.logEvent('screen_view', { screen_name: name, device_id: this.uniqueDeviceId });
    });
  }

  public logEvent(type: string, params?: any): void {
    this.platform.ready().then(() => {
      console.log('==== logEvent ====', type, params);
      this.firebase.logEvent(type, params);
    });
  }

  private updateUserId(userId: string): void {
    this.firebase.setUserId(userId)
      .then(() => { })
      .catch(error => console.log(`Error setting user ID ${userId}`, error));
  }

  public addUserProperty(key: string, value: string): void {
    this.firebase.setUserProperty(key, value)
      .then(() => { })
      .catch(error => console.log(`Error adding user property "${key}: ${value}", ${error}`));
  }

  public addCustomDimension(key: number, value: string): void {
    console.log('==== addCustomDimension ====', key, value);
  }

  public logError(type: string, message: string): void {
    this.logEvent(AnalyticsEvents.ERROR, {
      [AnalyticsParams.ERROR_TYPE]: type,
      [AnalyticsParams.ERROR_MESSAGE]: message,
    });
  }

  public logException(message: string, fatal: boolean): void {
    this.logEvent(AnalyticsEvents.ERROR, {
      [AnalyticsParams.ERROR_TYPE]: AnalyticsParams.ERROR_EXCEPTION,
      [AnalyticsParams.ERROR_MESSAGE]: message,
      [AnalyticsParams.ERROR_FATAL]: fatal ? '1' : '0',
    });
  }

  public getDiffDays(userDate: string): number {
    const today = new DateTime();
    return today.daysDiff(userDate);
  }

  public getDescriptiveDate(userDate: string): string {
    let ret: string;

    const daysDiff = this.getDiffDays(userDate);

    switch (daysDiff) {
      case -1:
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
