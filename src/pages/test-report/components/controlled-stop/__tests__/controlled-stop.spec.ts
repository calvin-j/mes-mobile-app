import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ControlledStopComponent } from '../controlled-stop';
import { IonicModule } from 'ionic-angular';
import { StoreModule, Store } from '@ngrx/store';
import { testsReducer } from '../../../../../modules/tests/tests.reducer';
import { testReportReducer } from '../../../test-report.reducer';
import { StoreModel } from '../../../../../shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { CompetencyButtonComponent } from '../../../components/competency-button/competency-button';
import { TickIndicatorComponent } from '../../../../../components/common/tick-indicator/tick-indicator';
import {
  DrivingFaultsBadgeComponent } from '../../../../../components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '../../../../../components/common/serious-fault-badge/serious-fault-badge';
import {
  DangerousFaultBadgeComponent,
} from '../../../../../components/common/dangerous-fault-badge/dangerous-fault-badge';
import { StartTest } from '../../../../journal/journal.actions';
import {
  ControlledStopAddDrivingFault,
  ControlledStopRemoveFault,
} from '../../../../../modules/tests/test-data/test-data.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

describe('ControlledStopComponent', () => {
  let fixture: ComponentFixture<ControlledStopComponent>;
  let component: ControlledStopComponent;
  let store$: Store<StoreModel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ControlledStopComponent,
        MockComponent(TickIndicatorComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DangerousFaultBadgeComponent),
        MockComponent(CompetencyButtonComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer, testReport: testReportReducer }),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ControlledStopComponent);
        component = fixture.componentInstance;
        store$ = TestBed.get(Store);
        store$.dispatch(new StartTest(105));
      });
  }));

  describe('Class', () => {
    describe('ControlledStopAddDrivingFault', () => {
      it('should dispatch an CONTROLLED_STOP_ADD_DRIVING_FAULT action for press', () => {

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new ControlledStopAddDrivingFault());
      });
      it('should not dispatch an CONTROLLED_STOP_ADD_DRIVING_FAULT action for tap', () => {

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new ControlledStopAddDrivingFault());
      });
      it('should not dispatch an CONTROLLED_STOP_ADD_DRIVING_FAULT action if there is already a driving fault', () => {
        component.controlledStopOutcome = CompetencyOutcome.DF;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new ControlledStopAddDrivingFault());
      });
      it('should not dispatch an ADD_MANOEUVRE_DRIVING_FAULT action if there is a serious fault', () => {
        component.controlledStopOutcome = CompetencyOutcome.S;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new ControlledStopAddDrivingFault());
      });
      it('should not dispatch an ADD_MANOEUVRE_DRIVING_FAULT action if serious mode is active', () => {
        component.isSeriousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new ControlledStopAddDrivingFault());
      });
      it('should not dispatch an ADD_MANOEUVRE_DRIVING_FAULT action if there is a dangerous fault', () => {
        component.controlledStopOutcome = CompetencyOutcome.D;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new ControlledStopAddDrivingFault());
      });
      it('should not dispatch an ADD_MANOEUVRE_DRIVING_FAULT action if dangerous mode is active', () => {
        component.isDangerousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new ControlledStopAddDrivingFault());
      });
    });

    describe('removeManoeuvreDrivingFault', () => {
      it('should dispatch a REMOVE_MANOEUVRE_FAULT action for press', () => {
        component.isRemoveFaultMode = true;
        component.controlledStopOutcome = CompetencyOutcome.DF;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new ControlledStopRemoveFault());

      });
      it('should dispatch a REMOVE_MANOEUVRE_FAULT action for tap', () => {
        component.isRemoveFaultMode = true;
        component.controlledStopOutcome = CompetencyOutcome.DF;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new ControlledStopRemoveFault());
      });
      it('should not dispatch a REMOVE_MANOEUVRE_FAULT action if in the wrong mode', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.controlledStopOutcome = CompetencyOutcome.D;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new ControlledStopRemoveFault());
      });

      it('should dispatch a REMOVE_MANOEUVRE_FAULT action if there is a serious fault', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.controlledStopOutcome = CompetencyOutcome.S;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new ControlledStopRemoveFault());
      });
      it('should dispatch a REMOVE_MANOEUVRE_FAULT action if there is a dangerous fault', () => {
        component.isRemoveFaultMode = true;
        component.isDangerousMode = true;
        component.controlledStopOutcome = CompetencyOutcome.D;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new ControlledStopRemoveFault());
      });
    });
  });

  describe('DOM', () => {
    it('should pass the number of driving faults to the driving faults badge component', () => {
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;
      component.controlledStopOutcome = CompetencyOutcome.DF;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(1);
    });

    it('should pass a ripple value of false to the competency button component', () => {
      fixture.detectChanges();
      component.isRemoveFaultMode = true;
      component.isSeriousMode = true;
      const competencyButton = fixture.debugElement.query(By.css('competency-button.controlled-stop-competency'))
        .componentInstance as CompetencyButtonComponent;

      fixture.detectChanges();
      expect(competencyButton.ripple).toEqual(false);
    });

    describe('Tick button effects', () => {
      it('should have added no classes to the tick button', () => {
        const tickButton = fixture.debugElement.query(By.css('competency-button.controlled-stop-tick'));

        fixture.detectChanges();
        expect(tickButton.nativeElement.className).toEqual('controlled-stop-tick');
      });

      it('should have added a checked class to the tick button', () => {
        component.toggleControlledStop();
        const tickButton = fixture.debugElement.query(By.css('competency-button.controlled-stop-tick'));

        fixture.detectChanges();
        expect(tickButton.nativeElement.className).toEqual('controlled-stop-tick checked');
      });

    });
  });

});
