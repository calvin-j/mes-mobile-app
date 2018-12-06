import { DeviceAuthentication } from '../../types/device-authentication';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppConfigProvider } from '../../providers/app-config/app-config';
import { PretestChecksPage } from '../pretest-checks/pretest-checks';
import { EndTestReasonPage } from '../end-test-reason/end-test-reason';
import { Page } from 'ionic-angular/navigation/nav-util';

import { IJournal, ICandidateName } from '../../providers/journal/journal-model';
import { getFormattedCandidateName } from '../../shared/utils/formatters';
import { MesSignaturePadComponent } from '../../components/mes-signature-pad/mes-signature-pad';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { AnalyticsScreenNames } from '../../providers/analytics/analytics.model';
import { HelpWaitingRoomPage } from '../../help/pages/help-waiting-room/help-waiting-room';

@Component({
  selector: 'page-declaration-consent',
  templateUrl: 'declaration-consent.html'
})
export class DeclarationConsentPage {
  pretestChecksPage: Page = PretestChecksPage;
  endTestReasonPage: Page = EndTestReasonPage;
  helpPage: Page = HelpWaitingRoomPage;
  signaturePadOptions: any;

  checkInsurance: boolean = false;
  checkResidence: boolean = false;

  slotDetail: IJournal;

  @ViewChild(MesSignaturePadComponent)
  signaturePad: MesSignaturePadComponent;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public configService: AppConfigProvider,
    private deviceAuth: DeviceAuthentication,
    public logging: AnalyticsProvider
  ) {
    this.signaturePadOptions = configService.getSignaturePadOptions();
    this.slotDetail = this.navParams.get('slotDetail');
  }

  ionViewDidEnter() {
    this.logging.setCurrentPage(AnalyticsScreenNames.WAITING_ROOM);
  }

  updateValidation(prop: string) {
    this[prop] = !this[prop];
  }

  validation() {
    return !(this.checkInsurance && this.checkResidence && this.signaturePad.getSignature());
  }

  continue() {
    this.deviceAuth
      .runAuthentication('Please authenticate yourself to proceed')
      .then((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.navCtrl.push(this.pretestChecksPage, { slotDetail: this.slotDetail });
        }
      })
      .catch((errorMsg: string) => {
        if (errorMsg === 'cordova_not_available' || errorMsg === 'plugin_not_installed') {
          this.navCtrl.push(this.pretestChecksPage, { slotDetail: this.slotDetail });
        }
      });
  }

  /**
   * Returns concatenated Candidate name for this slot
   */
  getCandidateName(): string {
    return getFormattedCandidateName(this.slotDetail.candidateName);
  }

  /**
   * Just returns the Driver Number
   */
  getDriverNumber(): string {
    return this.slotDetail.driverNumber;
  }

  onEndTest(): void {
    this.navCtrl.pop();
  }

  getTitle(): string {
    const name: ICandidateName = this.slotDetail.candidateName;
    return `Declaration - ${name.firstName} ${name.lastName}`;
  }
}