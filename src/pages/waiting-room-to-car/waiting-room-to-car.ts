import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PracticeableBasePageComponent } from '../../shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '../../shared/models/store.model';
import * as waitingRoomToCarActions from './waiting-room-to-car.actions';
import { Observable } from 'rxjs/Observable';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/B';
import { getCurrentTest, getJournalData } from '../../modules/tests/tests.selector';
import {
  SchoolCarToggled,
  DualControlsToggled,
  GearboxCategoryChanged,
  VehicleRegistrationChanged,
} from '../../modules/tests/vehicle-details/vehicle-details.actions';
import { map } from 'rxjs/operators';
import {
  InstructorAccompanimentToggled,
  OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
  InterpreterAccompanimentToggled,
} from '../../modules/tests/accompaniment/accompaniment.actions';
import { getVehicleDetails } from '../../modules/tests/vehicle-details/vehicle-details.reducer';
import { getAccompaniment } from '../../modules/tests/accompaniment/accompaniment.reducer';
import { InstructorRegistrationNumberChanged } from '../../modules/tests/instructor-details/instructor-details.actions';
import {
  getRegistrationNumber,
  getGearboxCategory,
  getSchoolCar,
  getDualControls,
  isAutomatic,
  isManual,
} from '../../modules/tests/vehicle-details/vehicle-details.selector';
import {
  getInstructorAccompaniment,
  getSupervisorAccompaniment,
  getOtherAccompaniment,
  getInterpreterAccompaniment,
} from '../../modules/tests/accompaniment/accompaniment.selector';
import { getCandidate } from '../../modules/tests/candidate/candidate.reducer';
import { getUntitledCandidateName } from '../../modules/tests/candidate/candidate.selector';
import { getTests } from '../../modules/tests/tests.reducer';
import { FormGroup } from '@angular/forms';
import { TellMeQuestion } from '../../providers/question/tell-me-question.model';
import { QuestionProvider } from '../../providers/question/question';
import { getInstructorDetails } from '../../modules/tests/instructor-details/instructor-details.reducer';
import { getInstructorRegistrationNumber } from '../../modules/tests/instructor-details/instructor-details.selector';
import {
  TellMeQuestionSelected,
  TellMeQuestionCorrect,
  TellMeQuestionDrivingFault,
  QuestionOutcomes,
  EyesightTestReset,
  EyesightTestPassed,
  EyesightTestFailed,
} from '../../modules/tests/test-data/test-data.actions';
import {
  isTellMeQuestionSelected,
  isTellMeQuestionDrivingFault,
  isTellMeQuestionCorrect,
  tellMeQuestionOutcome,
  getVehicleChecks,
  getTellMeQuestion,
  hasEyesightTestBeenCompleted,
  hasEyesightTestGotSeriousFault,
} from '../../modules/tests/test-data/test-data.selector';
import { getTestData } from '../../modules/tests/test-data/test-data.reducer';
import { PersistTests } from '../../modules/tests/tests.actions';
import { WAITING_ROOM_TO_CAR_PAGE, TEST_REPORT_PAGE } from '../page-names.constants';

interface WaitingRoomToCarPageState {
  candidateName$: Observable<string>;
  registrationNumber$: Observable<string>;
  instructorRegistrationNumber$: Observable<number>;
  transmission$: Observable<GearboxCategory>;
  schoolCar$: Observable<boolean>;
  dualControls$: Observable<boolean>;
  instructorAccompaniment$: Observable<boolean>;
  supervisorAccompaniment$: Observable<boolean>;
  otherAccompaniment$: Observable<boolean>;
  interpreterAccompaniment$: Observable<boolean>;
  eyesightTestComplete$: Observable<boolean>;
  eyesightTestFailed$: Observable<boolean>;
  gearboxAutomaticRadioChecked$: Observable<boolean>;
  gearboxManualRadioChecked$: Observable<boolean>;
  tellMeQuestionSelected$: Observable<boolean>;
  tellMeQuestionCorrect$: Observable<boolean>;
  tellMeQuestionDrivingFault$: Observable<boolean>;
  tellMeQuestionOutcome$: Observable<string>;
  tellMeQuestion$: Observable<TellMeQuestion>;
}

@IonicPage()
@Component({
  selector: 'page-waiting-room-to-car',
  templateUrl: 'waiting-room-to-car.html',
})
export class WaitingRoomToCarPage extends PracticeableBasePageComponent {
  pageState: WaitingRoomToCarPageState;
  form: FormGroup;

  @ViewChild('registrationInput')
  regisrationInput: ElementRef;

  @ViewChild('instructorRegistrationInput')
  instructorRegistrationInput: ElementRef;

  showEyesightFailureConfirmation: boolean = false;

  tellMeQuestions: TellMeQuestion[];

  constructor(
    store$: Store<StoreModel>,
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public questionProvider: QuestionProvider,
  ) {
    super(platform, navController, authenticationProvider, store$);
    this.tellMeQuestions = questionProvider.getTellMeQuestions();
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      registrationNumber$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getRegistrationNumber),
      ),
      instructorRegistrationNumber$: currentTest$.pipe(
        select(getInstructorDetails),
        map(getInstructorRegistrationNumber),
      ),
      transmission$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getGearboxCategory),
      ),
      schoolCar$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getSchoolCar),
      ),
      dualControls$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getDualControls),
      ),
      instructorAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getInstructorAccompaniment),
      ),
      supervisorAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getSupervisorAccompaniment),
      ),
      otherAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getOtherAccompaniment),
      ),
      interpreterAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getInterpreterAccompaniment),
      ),
      eyesightTestComplete$: currentTest$.pipe(
        select(getTestData),
        select(hasEyesightTestBeenCompleted),
      ),
      eyesightTestFailed$: currentTest$.pipe(
        select(getTestData),
        select(hasEyesightTestGotSeriousFault),
      ),
      gearboxAutomaticRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isAutomatic),
      ),
      gearboxManualRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isManual),
      ),
      tellMeQuestionSelected$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map(isTellMeQuestionSelected),
      ),
      tellMeQuestionOutcome$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map(tellMeQuestionOutcome),
      ),
      tellMeQuestionCorrect$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map(isTellMeQuestionCorrect),
      ),
      tellMeQuestionDrivingFault$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map(isTellMeQuestionDrivingFault),
      ),
      tellMeQuestion$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecks),
        map(getTellMeQuestion),
      ),
    };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(new waitingRoomToCarActions.WaitingRoomToCarViewDidEnter());
  }

  ionViewWillLeave(): void {
    this.store$.dispatch(new PersistTests());
  }

  schoolCarToggled(): void {
    this.store$.dispatch(new SchoolCarToggled());
  }

  dualControlsToggled(): void {
    this.store$.dispatch(new DualControlsToggled());
  }

  transmissionChanged(transmission: GearboxCategory): void {
    this.store$.dispatch(new GearboxCategoryChanged(transmission));
  }

  instructorAccompanimentToggled(): void {
    this.store$.dispatch(new InstructorAccompanimentToggled());
  }

  supervisorAccompanimentToggled(): void {
    this.store$.dispatch(new SupervisorAccompanimentToggled());
  }

  interpreterAccompanimentToggled(): void {
    this.store$.dispatch(new InterpreterAccompanimentToggled());
  }

  otherAccompanimentToggled(): void {
    this.store$.dispatch(new OtherAccompanimentToggled());
  }

  vehicleRegistrationChanged(vehicleRegistration: string) {
    this.store$.dispatch(new VehicleRegistrationChanged(vehicleRegistration));
  }

  instructorRegistrationChanged(instructorRegistration: number) {
    this.store$.dispatch(new InstructorRegistrationNumberChanged(instructorRegistration));
  }

  onSubmit() {
    Object.keys(this.form.controls).forEach(controlName => this.form.controls[controlName].markAsDirty());
    if (this.form.valid) {
      this.navController.push(TEST_REPORT_PAGE).then(() => {
        // remove Waiting Room To Car Page
        const view = this.navController.getViews().find(view => view.id === WAITING_ROOM_TO_CAR_PAGE);
        if (view) {
          this.navController.removeView(view);
        }
      });
    } else {
      Object.keys(this.form.controls).forEach((controlName) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(new waitingRoomToCarActions.WaitingRoomToCarValidationError(
            `${controlName} is blank`,
          ));
        }
      });
    }
  }
  updateForm(ctrl: string, value: any) {
    this.form.patchValue({
      [ctrl]: value,
    });
  }

  isCtrlDirtyAndInvalid(controlName: string): boolean {
    return !this.form.value[controlName] && this.form.get(controlName).dirty;
  }

  setEyesightFailureVisibility(show: boolean) {
    this.showEyesightFailureConfirmation = show;
  }

  eyesightFailCancelled = () => {
    this.updateForm('eyesightCtrl', null);
    this.store$.dispatch(new EyesightTestReset());
  }

  tellMeQuestionChanged(newTellMeQuestion: TellMeQuestion): void {
    this.store$.dispatch(new TellMeQuestionSelected(newTellMeQuestion));
    if (this.form.controls['tellMeQuestionOutcome']) {
      this.form.controls['tellMeQuestionOutcome'].setValue('');
    }
  }

  tellMeQuestionOutcomeChanged(outcome: string): void {
    if (outcome === QuestionOutcomes.Pass) {
      this.store$.dispatch(new TellMeQuestionCorrect());
      return;
    }
    this.store$.dispatch(new TellMeQuestionDrivingFault());
  }

  eyesightTestResultChanged(passed: boolean): void {
    const action = passed ? new EyesightTestPassed() : new EyesightTestFailed();
    this.store$.dispatch(action);
  }

}
