import { RekeySearchModel } from './rekey-search.reducer';

export const getIsLoading = (rekeySearch: RekeySearchModel) => rekeySearch.isLoading;

export const getHasSearched = (rekeySearch: RekeySearchModel) => rekeySearch.hasSearched;

export const getBookedTestSlot = (rekeySearch: RekeySearchModel) => rekeySearch.bookedTestSlot;
