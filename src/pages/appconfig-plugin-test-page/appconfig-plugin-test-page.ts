import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

declare var cordova;

@Component({
  selector: 'page-appconfig-plugin-test',
  templateUrl: 'appconfig-plugin-test-page.html'
})
export class AppconfigPluginTestPage {
  platformOS;
  platformOrientation;
  appconfigSettings;
  key = null; // null is supposed to bring back all keys

  constructor(public platform: Platform, public navCtrl: NavController) {
    this.platform.ready().then(() => {
      this.platformOS = this.platform.platforms();
      if (this.platform.isPortrait()) {
        this.platformOrientation = 'portrait';
      } else {
        this.platformOrientation = 'landscape';
      }
      this.appconfigSettings = this.getValue(this.key);
    });
  }

  getValue(key) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        console.log(cordova.plugins.AppConfig.getValue(key));
        return JSON.stringify(cordova.plugins.AppConfig.getValue(key));
      }
      return 'AppConfig not available on this device';
    });
  }
}
