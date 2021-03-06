import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Navbar, AlertController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { PracticeableBasePageComponent } from '../../shared/classes/practiceable-base-page';
import { SignatureAreaComponent } from '../../components/common/signature-area/signature-area';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '../../shared/models/store.model';
import { HealthDeclarationViewDidEnter, ContinueFromDeclaration } from './health-declaration.actions';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceAuthenticationProvider } from '../../providers/device-authentication/device-authentication';
import * as postTestDeclarationsActions
  from '../../modules/tests/post-test-declarations/post-test-declarations.actions';
import { getTests } from '../../modules/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '../../modules/tests/tests.selector';
import { getPostTestDeclarations } from '../../modules/tests/post-test-declarations/post-test-declarations.reducer';
import {
  getHealthDeclarationStatus,
  getReceiptDeclarationStatus,
  getSignatureStatus,
} from '../../modules/tests/post-test-declarations/post-test-declarations.selector';
import {
  getCandidateName, getCandidateDriverNumber, formatDriverNumber, getUntitledCandidateName,
} from '../../modules/tests/candidate/candidate.selector';
import { getCandidate } from '../../modules/tests/candidate/candidate.reducer';
import { map } from 'rxjs/operators';
import {
  getPassCertificateNumber,
  isProvisionalLicenseProvided,
} from '../../modules/tests/pass-completion/pass-completion.selector';
import { getPassCompletion } from '../../modules/tests/pass-completion/pass-completion.reducer';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { TranslateService } from 'ng2-translate';
import { getTestSlotAttributes } from '../../modules/tests/test-slot-attributes/test-slot-attributes.reducer';
import { isWelshTest } from '../../modules/tests/test-slot-attributes/test-slot-attributes.selector';
import { ProvisionalLicenseNotReceived } from '../../modules/tests/pass-completion/pass-completion.actions';
import {
  getCommunicationPreference,
} from '../../modules/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '../../modules/tests/communication-preferences/communication-preferences.selector';
import {
  TEST_REPORT_PAGE,
  DEBRIEF_PAGE,
  PASS_FINALISATION_PAGE,
  HEALTH_DECLARATION_PAGE,
  BACK_TO_OFFICE_PAGE,
} from '../page-names.constants';
import { includes } from 'lodash';

interface HealthDeclarationPageState {
  healthDeclarationAccepted$: Observable<boolean>;
  passCertificateNumberReceived$: Observable<boolean>;
  signature$: Observable<string>;
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  passCertificateNumber$: Observable<string>;
  licenseProvided$: Observable<boolean>;
  welshTest$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
}
@IonicPage()
@Component({
  selector: 'page-health-declaration',
  templateUrl: 'health-declaration.html',
})
export class HealthDeclarationPage extends PracticeableBasePageComponent {

  static readonly welshLanguage: string = 'Cymraeg';

  @ViewChild(SignatureAreaComponent)
  signatureArea: SignatureAreaComponent;

  @ViewChild(Navbar) navBar: Navbar;

  pageState: HealthDeclarationPageState;
  form: FormGroup;
  licenseProvided: boolean;
  healthDeclarationAccepted: boolean;
  subscription: Subscription;
  inputSubscriptions: Subscription[] = [];
  isBookedInWelsh: boolean;
  conductedLanguage: string;
  merged$: Observable<boolean | string>;

  constructor(
    store$: Store<StoreModel>,
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    private deviceAuthenticationProvider: DeviceAuthenticationProvider,
    private translate: TranslateService,
    public alertController: AlertController,

  ) {
    super(platform, navController, authenticationProvider, store$);
    this.form = new FormGroup(this.getFormValidation());
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(new HealthDeclarationViewDidEnter());
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.clickBack();
    };
  }

  clickBack(): void {
    this.deviceAuthenticationProvider.triggerLockScreen()
      .then(() => {
        this.navController.pop();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getFormValidation(): { [key: string]: FormControl } {
    return {
      healthCheckboxCtrl: new FormControl(''),
      receiptCheckboxCtrl: new FormControl('', [Validators.requiredTrue]),
      signatureAreaCtrl: new FormControl(null, [Validators.required]),
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.signatureArea.drawCompleteAction = postTestDeclarationsActions.SIGNATURE_DATA_CHANGED;
    this.signatureArea.clearAction = postTestDeclarationsActions.SIGNATURE_DATA_CLEARED;

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      healthDeclarationAccepted$: currentTest$.pipe(
        select(getPostTestDeclarations),
        select(getHealthDeclarationStatus),
      ),
      passCertificateNumberReceived$: currentTest$.pipe(
        select(getPostTestDeclarations),
        select(getReceiptDeclarationStatus),
      ),
      signature$: currentTest$.pipe(
        select(getPostTestDeclarations),
        select(getSignatureStatus),
      ),
      candidateName$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getJournalData),
        select(getCandidate),
        select(getCandidateName),
      ),
      candidateUntitledName$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      candidateDriverNumber$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
        map(formatDriverNumber),
      ),
      passCertificateNumber$: currentTest$.pipe(
        select(getPassCompletion),
        select(getPassCertificateNumber),
      ),
      licenseProvided$: currentTest$.pipe(
        select(getPassCompletion),
        map(isProvisionalLicenseProvided),
      ),
      welshTest$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(isWelshTest),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
    };
    this.rehydrateFields();

    const { welshTest$, licenseProvided$, healthDeclarationAccepted$, conductedLanguage$ } = this.pageState;

    this.merged$ = merge(
      welshTest$.pipe(map(isWelsh => this.isBookedInWelsh = isWelsh)),
      licenseProvided$.pipe(map(val => this.licenseProvided = val)),
      healthDeclarationAccepted$.pipe(map(val => this.healthDeclarationAccepted = val)),
      conductedLanguage$.pipe(map(language => this.conductedLanguage = language)),
    );

    this.configureI18N(this.conductedLanguage === HealthDeclarationPage.welshLanguage);

  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }

    return true;
  }

  rehydrateFields(): void {
    this.inputSubscriptions.push(
      this.pageState.healthDeclarationAccepted$
        .subscribe((val) => {
          this.form.controls['healthCheckboxCtrl'].setValue(val);
        }),
    );
    this.inputSubscriptions.push(
      this.pageState.passCertificateNumberReceived$
        .subscribe((val) => {
          this.form.controls['receiptCheckboxCtrl'].setValue(val);
        }),
    );
    this.inputSubscriptions.push(
      this.pageState.signature$
        .subscribe((val) => {
          this.form.controls['signatureAreaCtrl'].setValue(val);
        }),
    );
  }

  configureI18N(isWelsh: boolean): void {
    if (this.isBookedInWelsh && isWelsh) {
      this.translate.use('cy');
    }
  }

  healthDeclarationChanged(): void {
    this.store$.dispatch(new postTestDeclarationsActions.ToggleHealthDeclaration());
  }

  receiptDeclarationChanged(): void {
    this.store$.dispatch(new postTestDeclarationsActions.ToggleReceiptDeclaration());
  }

  onSubmit() {
    Object.keys(this.form.controls).forEach(controlName => this.form.controls[controlName].markAsDirty());
    if (this.form.valid) {
      if (!this.healthDeclarationAccepted) {
        this.showConfirmHealthDeclarationModal();
      } else {
        this.persistAndNavigate(false);
      }
    }
  }

  showConfirmHealthDeclarationModal() {
    const shortMessage = 'Remind the candidate to contact DVLA';
    const extendedMessage =
      // tslint:disable-next-line:max-line-length
      `You need to give the provisional license back to the candidate.<br/>The field 'Driver license received' will be automatically changed to 'no'.<br/>${shortMessage}`;
    const alert = this.alertController.create({
      title: 'The candidate has not confirmed the health declaration',
      message: this.licenseProvided ? extendedMessage : shortMessage,
      cssClass: 'confirm-declaration-modal',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { },
        },
        {
          text: 'Continue',
          handler: () => this.persistAndNavigate(true),
        },
      ],
      enableBackdropDismiss: false,
    });
    alert.present();
  }

  persistAndNavigate(resetLicenseProvided: boolean) {
    this.deviceAuthenticationProvider.triggerLockScreen()
      .then(() => {
        if (this.licenseProvided && resetLicenseProvided) {
          this.store$.dispatch(new ProvisionalLicenseNotReceived());
        }
        this.store$.dispatch(new ContinueFromDeclaration());
        this.navController.push(BACK_TO_OFFICE_PAGE).then(() => {
          this.navController.getViews().forEach((view) => {
            if (includes([TEST_REPORT_PAGE, DEBRIEF_PAGE, PASS_FINALISATION_PAGE, HEALTH_DECLARATION_PAGE],
              view.id)) {
              this.navController.removeView(view);
            }
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isCtrlDirtyAndInvalid(controlName: string): boolean {
    return !this.form.get(controlName).valid && this.form.get(controlName).dirty;
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.inputSubscriptions) {
      this.inputSubscriptions.forEach(sub => sub.unsubscribe());
    }
  }

}
