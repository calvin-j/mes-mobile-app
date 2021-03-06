import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PracticeableBasePageComponent } from '../../shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../shared/models/store.model';
import { BackToOfficeViewDidEnter, DeferWriteUp } from './back-to-office.actions';
import { DeviceProvider } from '../../providers/device/device';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Insomnia } from '@ionic-native/insomnia';

@IonicPage()
@Component({
  selector: 'page-back-to-office',
  templateUrl: 'back-to-office.html',
})
export class BackToOfficePage extends PracticeableBasePageComponent {

  constructor(
    store$: Store<StoreModel>,
    private deviceProvider: DeviceProvider,
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public screenOrientation: ScreenOrientation,
    public insomnia: Insomnia,
  ) {
    super(platform, navController, authenticationProvider, store$);
  }

  ionViewDidEnter(): void {
    if (super.isIos()) {
      this.screenOrientation.unlock();
      this.insomnia.allowSleepAgain();

      if (!this.isPracticeMode) {
        this.deviceProvider.disableSingleAppMode();
      }
    }

    this.store$.dispatch(new BackToOfficeViewDidEnter());
  }

  goToJournal() {
    if (this.isPracticeMode) {
      this.exitPracticeMode();
      return;
    }
    this.store$.dispatch(new DeferWriteUp());
    this.navController.popToRoot();
  }
}
