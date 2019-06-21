export interface IAnalyticsProvider {
  setCurrentPage(name: string): void;

  addCustomDimension(key: number, value: string): void;

  logEvent(category: string, event: string, label?:string, params?: any): void;

  logError(type:string, message: string): void;

  logException(message: string, fatal: boolean): void;

  setDeviceId(): void;
  setUserId(): void;
  initialiseAnalytics(): void;

}

export enum AnalyticsScreenNames {
    CONTACT_DETAILS = 'contact details screen', // this may need removing as could be candidate details now
    FAIL_RESULTS_DEBRIEF = 'fail results debrief screen',
    HEALTH_DECLARATION = 'health declaration screen',
    JOURNAL = 'journal screen',
    OFFICE = 'office screen',
    PASS_FINALISATION = 'pass finalisation screen',
    PASS_RESULTS_DEBRIEF = 'pass results debrief screen',
    TEST = 'test report screen',
    TERMINATE_TEST = 'terminate test screen',
    WAITING_ROOM = 'waiting room screen',
    WAITING_ROOM_TO_CAR = 'waiting room to car screen',
    WELCOME = 'welcome screen',
    CANDIDATE_DETAILS = 'candidate details screen',
    DEBRIEF = 'debrief screen',
    LOGIN = 'login screen',
    BACK_TO_OFFICE = 'back to office screen',
  }

export enum AnalyticsEvents {
    START_TEST = 'start_test',
    END_TEST = 'end_test',
    APP_LOAD = 'app_load',
    SLOT_CHANGED = 'slot_changed',
    SLOT_CHANGE_VIEWED = 'slot_change_viewed',
    SLOT_VIEWED = 'slot_viewed',
    NAVIGATION = 'navigation',
    REFRESH_JOURNAL = 'refresh_journal',
    LOGIN = 'login',
    JOURNAL_NAVIGATION = 'journal_navigation',
    JOURNAL_SLOT_CHANGED = 'journal_slot_changed',
    JOURNAL_SLOT_CHANGE_VIEWED = 'journal_slot_change_viewed',
    ADD_FAULT = 'add_fault',
    REMOVE_FAULT = 'remove_fault',
    ERROR = 'error',
  }

export enum AnalyticsParams {
    START_TEST = 'start_test',
    END_TEST = 'end_test',
    APP_LOAD = 'app_load',
    SLOT_CHANGED = 'slot_changed',
    SLOT_CHANGE_VIEWED = 'slot_change_viewed',
    NAVIGATION = 'navigation',
    REFRESH_JOURNAL = 'refresh_journal',
    LOGIN = 'login',
    JOURNAL_NAVIGATION = 'journal_navigation',
    JOURNAL_DATE = 'journal_date',
    JOURNAL_SLOT_CHANGED = 'journal_slot_changed',
    JOURNAL_SLOT_CHANGE_VIEWED = 'journal_slot_change_viewed',
    ADD_FAULT = 'add_fault',
    REMOVE_FAULT = 'remove_fault',
    SLOT_ID = 'slot_id',
    REFRESH_MODE = 'refresh_mode',
    ACTION = 'action',
    JOURNAL_DAYS_FROM_TODAY = 'journal_days_from_today',
    CANDIDATE_WITH_SPECIAL_NEEDS = 'candidate_with_special_needs',
    CANDIDATE_WITH_CHECK = 'candidate_with_check',
    CANDIDATE_ID = 'candidate_id',
    ERROR_TYPE = 'error_type',
    ERROR_EXCEPTION = 'error_exception',
    ERROR_MESSAGE = 'error_message',
    ERROR_FATAL = 'error_fatal',
  }

export enum JournalRefreshModes {
    MANUAL = 'MANUAL',
    AUTOMATIC = 'AUTOMATIC',
  }
