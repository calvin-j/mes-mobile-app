import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import {
  JOURNAL_VIEW_DID_ENTER,
  JOURNAL_NAVIGATE_DAY,
  JournalNavigateDay,
  JOURNAL_REFRESH,
  JournalRefresh,
  JOURNAL_REFRESH_ERROR,
  START_TEST,
  StartTest,
  JournalRefreshError } from '../../pages/journal/journal.actions';
import {
    AnalyticsScreenNames,
    AnalyticsParams,
    AnalyticsEvents,
  } from '../../providers/analytics/analytics.model';
import { SLOT_HAS_CHANGED, SlotHasChanged } from '../../providers/slot/slot.actions';

@Injectable()
export class JournalAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  @Effect()
  journalView$ = this.actions$.pipe(
    ofType(JOURNAL_VIEW_DID_ENTER),
    switchMap(
      () => {
        this.analytics.setCurrentPage(AnalyticsScreenNames.JOURNAL);
        return of();
      },
    ),
  );

  @Effect()
  journalNavigation$ = this.actions$.pipe(
    ofType(JOURNAL_NAVIGATE_DAY),
    switchMap(
      (action: JournalNavigateDay) => {
        this.analytics.logEvent(AnalyticsEvents.JOURNAL_NAVIGATION, {
          [AnalyticsParams.JOURNAL_DATE]: this.analytics.getDescriptiveDate(action.day),
          [AnalyticsParams.JOURNAL_DAYS_FROM_TODAY]: this.analytics.getDiffDays(action.day).toString(),
        });

        if (this.analytics.getDiffDays(action.day) !== 0) {
          this.analytics.setCurrentPage(
          `${AnalyticsScreenNames.JOURNAL} - ${this.analytics.getDescriptiveDate(action.day)}`);
        } else {
          this.analytics.setCurrentPage(AnalyticsScreenNames.JOURNAL);
        }
        return of();
      },
    ),
  );

  @Effect()
  journalRefresh$ = this.actions$.pipe(
    ofType(JOURNAL_REFRESH),
    switchMap(
      (action: JournalRefresh) => {
        this.analytics.logEvent(AnalyticsEvents.REFRESH_JOURNAL, {
          [AnalyticsParams.REFRESH_MODE]: action.mode,
        });
        return of();
      },
    ),
  );

  @Effect()
  journalRefreshError$ = this.actions$.pipe(
    ofType(JOURNAL_REFRESH_ERROR),
    switchMap(
      (action: JournalRefreshError) => {
        this.analytics.logError(action.errorDescription, action.errorMessage);
        return of();
      },
    ),
  );

  @Effect()
  slotChanged$ = this.actions$.pipe(
    ofType(SLOT_HAS_CHANGED),
    switchMap(
      (action: SlotHasChanged) => {
        this.analytics.logEvent(AnalyticsEvents.JOURNAL_SLOT_CHANGED, {
          [AnalyticsParams.SLOT_CHANGED]: action.slotId.toString(),
        });
        return of();
      },
    ),
  );

  @Effect()
  testOutcomeStartTest$ = this.actions$.pipe(
    ofType(START_TEST),
    switchMap((action: StartTest) => {
      this.analytics.logEvent(AnalyticsEvents.START_TEST, {
        [AnalyticsParams.SLOT_ID]: action.slotId.toString(),
      });
      return of();
    }),
  );

}
