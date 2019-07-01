import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import {
  AnalyticsScreenNames, AnalyticsParams,
} from '../../providers/analytics/analytics.model';
import {
  WAITING_ROOM_VIEW_DID_ENTER,
  WaitingRoomViewDidEnter,
} from '../../pages/waiting-room/waiting-room.actions';
import { StoreModel } from '../../shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { getTests } from '../../modules/tests/tests.reducer';
import { getCurrentTestSlotId, getCurrentTest, getJournalData } from '../../modules/tests/tests.selector';
import { getCandidate } from '../../modules/tests/candidate/candidate.reducer';
import { getCandidateId } from '../../modules/tests/candidate/candidate.selector';

@Injectable()
export class WaitingRoomAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }
  @Effect()
  waitingRoomViewDidEnter$ = this.actions$.pipe(
    ofType(WAITING_ROOM_VIEW_DID_ENTER),
    withLatestFrom(
      this.store$.pipe(
        select(getTests),
        select(getCurrentTestSlotId),
      ),
      this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getJournalData),
        select(getCandidate),
        select(getCandidateId),
        ),
    ),
    switchMap(([action, slotId, candidateId]: [WaitingRoomViewDidEnter, string, number]) => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.WAITING_ROOM);
      this.analytics.logEvent(AnalyticsScreenNames.WAITING_ROOM, {
        [AnalyticsParams.SLOT_ID]: slotId,
        [AnalyticsParams.CANDIDATE_ID]: candidateId,
      });
      return of();
    }),
  );

}
