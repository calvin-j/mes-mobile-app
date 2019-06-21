import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '../../shared/models/store.model';
import { getJournalState } from '../journal/journal.reducer';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import {
    AnalyticsScreenNames,
    AnalyticsParams,
    AnalyticsEvents,
} from '../../providers/analytics/analytics.model';

import {
    getSlotById,
    getSlots,
    isCandidateSpecialNeeds,
    getCandidateId,
    isCandidateCheckNeeded,
} from './candidate-details.selector';

import {
  CANDIDATE_DETAILS_VIEW_DID_ENTER,
  CandidateDetailsViewDidEnter,
  CANDIDATE_DETAILS_SLOT_CHANGE_VIEWED,
  CandidateDetailsSlotChangeViewed,
} from './candidate-details.actions';

@Injectable()
export class CandidateDetailsAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  @Effect()
    candidateView$ = this.actions$.pipe(
      ofType(CANDIDATE_DETAILS_VIEW_DID_ENTER),
      withLatestFrom(
        this.store$.pipe(
          select(getJournalState),
          map(getSlots),
        ),
      ),
      switchMap(([action, slots]: [CandidateDetailsViewDidEnter, any[]]) => {
        const slot = getSlotById(slots, action.slotId);
        const specNeeds = isCandidateSpecialNeeds(slot);
        const candidateCheck = isCandidateCheckNeeded(slot);
        const candidateId = getCandidateId(slot);

        this.analytics.logEvent(AnalyticsEvents.SLOT_VIEWED, {
          [AnalyticsParams.SLOT_ID]: action.slotId.toString(),
          [AnalyticsParams.CANDIDATE_ID]: candidateId,
          [AnalyticsParams.CANDIDATE_WITH_SPECIAL_NEEDS]: specNeeds ? '1' : '0',
          [AnalyticsParams.CANDIDATE_WITH_CHECK]: candidateCheck ? '1' : '0',
        });
        this.analytics.setCurrentPage(AnalyticsScreenNames.CANDIDATE_DETAILS);
        return of();
      }),
    );

  @Effect()
    slotChangeViewed$ = this.actions$.pipe(
      ofType(CANDIDATE_DETAILS_SLOT_CHANGE_VIEWED),
      switchMap((action: CandidateDetailsSlotChangeViewed) => {
        this.analytics.logEvent(AnalyticsEvents.SLOT_CHANGE_VIEWED, {
          [AnalyticsParams.SLOT_ID]: action.slotId.toString(),
        });
        return of();
      }),
    );
}
