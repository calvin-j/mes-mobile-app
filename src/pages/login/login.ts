import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Store } from '@ngrx/store';

import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { BasePageComponent } from '../../shared/classes/base-page';
import { AuthenticationError } from '../../providers/authentication/authentication.constants';
import { DeviceError } from '../../providers/device/device.constants';
import { DeviceProvider } from '../../providers/device/device';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { StoreModel } from '../../shared/models/store.model';
import { StartSendingLogs, LoadLog } from '../../modules/logs/logs.actions';
import { NetworkStateProvider } from '../../providers/network-state/network-state';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BasePageComponent {

  authenticationError: AuthenticationError;
  deviceTypeError: DeviceError;
  hasUserLoggedOut: boolean = false;
  hasDeviceTypeError: boolean = false;
  unauthenticatedMode: boolean = false;
  debugLogs: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public splashScreen: SplashScreen,
    private store$: Store<StoreModel>,
    public networkStateProvider: NetworkStateProvider,
    public authenticationProvider: AuthenticationProvider,
    public appConfigProvider: AppConfigProvider,
    public analytics: AnalyticsProvider,
    public deviceProvider: DeviceProvider,
  ) {
    super(platform, navCtrl, authenticationProvider, false);

    // Check to see if redirect to page was from a logout
    this.hasUserLoggedOut = navParams.get('hasLoggedOut');
    this.networkStateProvider.initialiseNetworkState();

    // Trigger Authentication if this isn't a logout and is an ios device
    if (!this.hasUserLoggedOut && this.isIos()) {
      this.login();
    }
    if (!this.isIos()) {
      this.appConfigProvider.initialiseAppConfig();
      this.navController.setRoot('JournalPage');
      this.splashScreen.hide();
    }
  }

  login = async (): Promise<any> => {
    this.debugLogs.push('In Login page login method...');
    await this.platform.ready();
    this.debugLogs.push('platform.ready success');
    this.initialiseAppConfig()
    .then(() => {
      this.debugLogs.push('initialiseAppConfig success');
      return this.initialiseAuthentication();
    })
    .then(() => {
      this.debugLogs.push('initialiseAuthentication success');
      return this.authenticationProvider
      .login()
      .then((accessToken) => {
        this.debugLogs.push(JSON.stringify(accessToken));
        this.debugLogs.push('authenticationProvider.login success');
        return this.store$.dispatch(new LoadLog());
      })
      .then(() => {
        this.debugLogs.push('LoadLog');
        return this.appConfigProvider.loadRemoteConfig();
      })
      .then(() => {
        this.debugLogs.push('loadRemoteConfig success');
        return this.analytics.initialiseAnalytics();
      })
      .then(() => {
        this.debugLogs.push('initialiseAnalytics success');
        return this.store$.dispatch(new StartSendingLogs());
      })
      .then(() => {
        this.debugLogs.push('StartSendingLogs');
        return this.validateDeviceType();
      })
      .catch((error: AuthenticationError) => {
        this.authenticationError = error;
        this.debugLogs.push(this.displayError());
        if (error === AuthenticationError.USER_CANCELLED) {
          this.analytics.logException(error, true);
        }
        if (error === AuthenticationError.USER_NOT_AUTHORISED) {
          this.authenticationProvider.logout();
        }
        console.log(error);
      })
      .then(() => this.hasUserLoggedOut = false)
      .then(() => this.splashScreen.hide());
    });
  }

  displayError() {
    if (typeof this.authenticationError === 'object') return JSON.stringify(this.authenticationError);
    return this.authenticationError;
  }

  initialiseAppConfig = (): Promise<void> => {
    return new Promise((resolve) => {
      this.appConfigProvider.initialiseAppConfig();
      resolve();
    });
  }

  initialiseAuthentication = (): Promise<void> => {
    return new Promise((resolve) => {
      this.authenticationProvider.initialiseAuthentication();
      this.authenticationProvider.determineAuthenticationMode();
      resolve();
    });
  }

  validateDeviceType = (): void => {
    const validDevice = this.deviceProvider.validDeviceType();
    if (!validDevice) {
      this.deviceTypeError = DeviceError.UNSUPPORTED_DEVICE;
      this.hasDeviceTypeError = true;
      this.analytics.logException(`${this.deviceTypeError}-${this.deviceProvider.getDeviceType()}`, true);
    } else {
      this.navController.setRoot('JournalPage');
    }
  }

  isInternetConnectionError = (): boolean => {
    return !this.hasUserLoggedOut && this.authenticationError === AuthenticationError.NO_INTERNET;
  }

  isUserCancelledError = (): boolean => {
    return !this.hasUserLoggedOut && this.authenticationError === AuthenticationError.USER_CANCELLED;
  }

  isUnknownError = (): boolean => {
    return !this.hasUserLoggedOut &&
      this.authenticationError &&
      this.authenticationError.valueOf() !== AuthenticationError.USER_CANCELLED &&
      this.authenticationError.valueOf() !== AuthenticationError.NO_INTERNET &&
      this.authenticationError.valueOf() !== AuthenticationError.USER_NOT_AUTHORISED;
  }

  isUserNotAuthorised = (): boolean => {
    return !this.hasUserLoggedOut && this.authenticationError === AuthenticationError.USER_NOT_AUTHORISED;
  }
}
