import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { AnalyticRecorded } from '../../providers/analytics/analytics.actions';
import {
  TEST_RESULT_SEARCH_VIEW_DID_ENTER,
  TestResultSearchViewDidEnter,
  PERFORM_APPLICATION_REFERENCE_SEARCH,
  PerformApplicationReferenceSearch,
  PERFORM_DRIVER_NUMBER_SEARCH,
  PERFORM_LDTM_SEARCH,
  PerformDriverNumberSearch,
  PerformLDTMSearch,

} from './test-results-search.actions';
import {
  AnalyticsScreenNames,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsDimensionIndices,
 } from '../../providers/analytics/analytics.model';

@Injectable()
export class TestResultsSearchAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    ) {
    this.analytics.initialiseAnalytics();
  }

  @Effect()
  testResultSearchViewDidEnter$ = this.actions$.pipe(
    ofType(TEST_RESULT_SEARCH_VIEW_DID_ENTER),
    switchMap((action: TestResultSearchViewDidEnter) => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.TEST_RESULTS_SEARCH);
      return of(new AnalyticRecorded());
    }),
  );

  @Effect()
  performApplicationReferenceSearch$ = this.actions$.pipe(
    ofType(PERFORM_APPLICATION_REFERENCE_SEARCH),
    switchMap((action: PerformApplicationReferenceSearch) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_RESULTS_SEARCH,
        AnalyticsEvents.APPLICATION_REFERENCE_SEARCH,
      );
      return of(new AnalyticRecorded());
    }),
  );

  @Effect()
  performDriverNumberSearch$ = this.actions$.pipe(
    ofType(PERFORM_DRIVER_NUMBER_SEARCH),
    switchMap((action: PerformDriverNumberSearch) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_RESULTS_SEARCH,
        AnalyticsEvents.DRIVER_NUMBER_SEARCH,
      );
      return of(new AnalyticRecorded());
    }),
  );

  @Effect()
  performLDTMSearch$ = this.actions$.pipe(
    ofType(PERFORM_LDTM_SEARCH),
    switchMap((action: PerformLDTMSearch) => {
      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.IS_DATE_RANGE_SEARCHED,
        action.advancedSearchParams.startDate || action.advancedSearchParams.endDate ? 'true' : 'false',
      );

      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.IS_STAFF_ID_SEARCHED,
        action.advancedSearchParams.staffNumber ? 'true' : 'false',
      );

      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.IS_TEST_CENTRE_SEARCHED,
        action.advancedSearchParams.costCode ? 'true' : 'false',
      );

      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_RESULTS_SEARCH,
        AnalyticsEvents.LDTM_SEARCH,
      );
      return of(new AnalyticRecorded());
    }),
  );

}