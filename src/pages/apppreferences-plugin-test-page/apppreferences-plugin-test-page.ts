import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-apppreferences-plugin-test',
  templateUrl: 'apppreferences-plugin-test-page.html'
})
export class ApppreferencesPluginTestPage implements OnInit, OnDestroy {
  prefsSubscription: Subscription;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public appPreferences: AppPreferences
  ) {}

  ngOnInit(): void {
    this.prefsSubscription = this.appPreferences.watch(true).subscribe((updates) => {
      alert('App prefs update');
      console.log('updates ', updates);
    });
  }

  ngOnDestroy(): void {
    // this.appPreferences.watch(false);
    // this.prefsSubscription.unsubscribe();
  }

  showPreferences() {
    this.platform.ready().then(
      (success) => {
        this.appPreferences.show().then(
          (success) => {
            console.log(success);
          },
          (fail) => {
            alert(fail);
          }
        );
      },
      (fails) => {
        console.log(fails);
      }
    );
  }

  readPreferences() {
    this.platform.ready().then(
      (success) => {
        this.appPreferences.fetch('title').then(
          (success) => {
            console.log(success);
          },
          (fail) => {
            alert(fail);
          }
        );
      },
      (fails) => {
        console.log(fails);
      }
    );
  }

  readRadio() {
    this.platform.ready().then(
      (success) => {
        this.appPreferences.fetch('lang').then(
          (success) => {
            console.log(success);
          },
          (fail) => {
            alert(fail);
          }
        );
      },
      (fails) => {
        console.log(fails);
      }
    );
  }

  showDefaults() {
    this.platform.ready().then(
      (success) => {
        console.log(this.appPreferences.defaults());
      },
      (fails) => {
        console.log(fails);
      }
    );
  }

  setPreference(key: string) {
    this.platform.ready().then(
      (success) => {
        // const appPrefs = this.appPreferences.iosSuite('group.uk.gov.dvsa.mobile-examiner');
        this.appPreferences.store('title', key).then(
          (success) => {
            console.log(success);
          },
          (fail) => {
            alert(fail);
          }
        );
      },
      (fails) => {
        console.log(fails);
      }
    );
  }

  getSuite() {
    this.platform.ready().then(
      (success) => {
        console.log(this.appPreferences.suite('group.uk.gov.dvsa.mobile-examiner'));
      },
      (fails) => {
        console.log(fails);
      }
    );
  }
}
