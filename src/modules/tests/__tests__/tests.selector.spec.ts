import {
  getCurrentTest,
  getTestStatus,
  isPassed,
  getTestOutcomeText,
  getActivityCode,
  isTestReportPracticeTest,
  isEndToEndPracticeTest,
  getActivityCodeBySlotId,
} from '../tests.selector';
import { JournalModel } from '../../../pages/journal/journal.model';
import { AppInfoModel } from '../../app-info/app-info.model';
import { LogsModel } from '../../logs/logs.model';
import { StandardCarTestCATBSchema } from '@dvsa/mes-test-schema/categories/B';
import { TestStatus } from '../test-status/test-status.model';
import { DateTime } from '../../../shared/helpers/date-time';
import { TestsModel } from '../tests.model';
import { ActivityCodes } from '../../../shared/models/activity-codes';
import {
  ActivityCodeDescription,
} from '../../../pages/office/components/activity-code/activity-code.constants';
import { testReportPracticeSlotId, end2endPracticeSlotId } from '../../../shared/mocks/test-slot-ids.mock';
import { TestOutcome } from '../tests.constants';

describe('testsSelector', () => {
  describe('getCurrentTest', () => {
    it('should return whichever test is the current one', () => {
      const currentTest: StandardCarTestCATBSchema = {
        category: 'B',
        journalData: {
          testSlotAttributes: {
            welshTest: false,
            slotId: 123,
            start: '11:34',
            vehicleTypeCode: 'C',
            extendedTest: false,
            specialNeeds: false,
          },
          examiner: {
            staffNumber: '',
          },
          testCentre: {
            centreId: 1,
            costCode: '',
          },
          candidate: {},
          applicationReference: {
            applicationId: 999,
            bookingSequence: 3,
            checkDigit: 5,
          },
        },
        activityCode: ActivityCodes.PASS,
        rekey: false,
        changeMarker: false,
        examinerBooked: 1,
        examinerConducted: 1,
        examinerKeyed: 1,
      };
      const journal: JournalModel = {
        isLoading: false,
        lastRefreshed: new Date(),
        slots: {},
        selectedDate: 'dummy',
        examiner: { staffNumber: '123', individualId: 456 },
        checkComplete: [],
      };
      const appInfo: AppInfoModel = { versionNumber: '0.0.0' };
      const logs: LogsModel = [];
      const state = {
        journal,
        appInfo,
        logs,
        tests: { startedTests: { 123: currentTest }, currentTest: { slotId: '123' }, testStatus: {} },
      };

      const result = getCurrentTest(state.tests);

      expect(result).toBe(currentTest);
    });
  });

  describe('getTestStatus', () => {
    it('should retrieve the status of the test with the given slotId', () => {
      const testState: TestsModel = {
        currentTest: { slotId: null },
        startedTests: {},
        testStatus: { 12345: TestStatus.Decided },
      };

      const result = getTestStatus(testState, 12345);

      expect(result).toBe(TestStatus.Decided);
    });

    it('should default to booked if the test with the given slot ID does not have a status yet', () => {
      const testState: TestsModel = {
        currentTest: { slotId: null },
        startedTests: {},
        testStatus: {},
      };

      const result = getTestStatus(testState, 12345);

      expect(result).toBe(TestStatus.Booked);
    });
  });

  describe('getTestOutcomeText', () => {
    const testState: StandardCarTestCATBSchema = {
      activityCode: ActivityCodes.PASS,
      category: 'x',
      journalData: {
        examiner: { staffNumber: '12345' },
        testCentre: { centreId: 1, costCode: '12345' },
        testSlotAttributes: {
          slotId: 12345,
          vehicleTypeCode: 'C',
          start: new DateTime().format('HH:mm'),
          welshTest: false,
          extendedTest: false,
          specialNeeds: false,
        },
        candidate: {},
        applicationReference: {
          applicationId: 123,
          bookingSequence: 1,
          checkDigit: 2,
        },
      },
      rekey: false,
      changeMarker: false,
      examinerBooked: 1,
      examinerConducted: 1,
      examinerKeyed: 1,
    };
    it('should retrieve a passed result for a pass activity code', () => {
      const result = getTestOutcomeText(testState);
      expect(result).toBe(TestOutcome.Passed);
    });
    it('should retrieve an unsuccessful result for a fail activity code', () => {
      testState.activityCode = ActivityCodes.FAIL;
      const result = getTestOutcomeText(testState);
      expect(result).toBe(TestOutcome.Failed);
    });
    it('should retrieve a terminated result for terminated activity code', () => {
      testState.activityCode = ActivityCodes.CANDIDATE_NOT_HAPPY_WITH_AUTHORISED_OCCUPANT;
      const result = getTestOutcomeText(testState);
      expect(result).toBe(TestOutcome.Terminated);
      expect(result).toBe('Terminated');
    });
  });

  describe('getTestOutcomeClass', () => {
    const testState: StandardCarTestCATBSchema = {
      activityCode: ActivityCodes.PASS,
      category: 'x',
      journalData: {
        examiner: { staffNumber: '12345' },
        testCentre: { centreId: 1, costCode: '12345' },
        testSlotAttributes: {
          slotId: 12345,
          vehicleTypeCode: 'C',
          start: new DateTime().format('HH:mm'),
          welshTest: false,
          extendedTest: false,
          specialNeeds: false,
        },
        candidate: {},
        applicationReference: {
          applicationId: 123,
          bookingSequence: 1,
          checkDigit: 2,
        },
      },
      rekey: false,
      changeMarker: false,
      examinerBooked: 1,
      examinerConducted: 1,
      examinerKeyed: 1,
    };
    it('should return true for a passed activity code', () => {
      const result = isPassed(testState);
      expect(result).toEqual(true);
    });
    it('should return false for a failed activity code', () => {
      testState.activityCode = ActivityCodes.FAIL;
      const result = isPassed(testState);
      expect(result).toEqual(false);
    });
    it('should return false for a terminated activity code', () => {
      testState.activityCode = ActivityCodes.MECHANICAL_FAILURE;
      const result = isPassed(testState);
      expect(result).toEqual(false);
    });
  });

  describe('getActivityCode', () => {
    const testState: StandardCarTestCATBSchema = {
      // DVSA_RADIO_FAILURE = '25'
      activityCode: ActivityCodes.DVSA_RADIO_FAILURE,
      category: 'x',
      journalData: {
        examiner: { staffNumber: '12345' },
        testCentre: { centreId: 1, costCode: '12345' },
        testSlotAttributes: {
          slotId: 12345,
          vehicleTypeCode: 'C',
          start: new DateTime().format('HH:mm'),
          welshTest: false,
          extendedTest: false,
          specialNeeds: false,
        },
        candidate: {},
        applicationReference: {
          applicationId: 123,
          bookingSequence: 1,
          checkDigit: 2,
        },
      },
      rekey: false,
      changeMarker: false,
      examinerBooked: 1,
      examinerConducted: 1,
      examinerKeyed: 1,
    };
    it('should return the DVSA_RADIO_FAILURE ActivityCode', () => {
      const activityCode = getActivityCode(testState);
      expect(activityCode.activityCode).toEqual(ActivityCodes.DVSA_RADIO_FAILURE);
      expect(activityCode.description).toEqual(ActivityCodeDescription.DVSA_RADIO_FAILURE);
    });
  });

  describe('isTestReportPracticeTest', () => {
    const testState: TestsModel = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: { 12345: TestStatus.Decided },
    };

    it('should return false when no tests started', () => {
      const result = isTestReportPracticeTest(testState);
      expect(result).toEqual(false);
    });

    it('should return false when slot id is numeric', () => {
      testState.currentTest.slotId = '1';
      const result = isTestReportPracticeTest(testState);
      expect(result).toEqual(false);
    });

    it('should return true when slot id starts with practice', () => {
      testState.currentTest.slotId = testReportPracticeSlotId;
      const result = isTestReportPracticeTest(testState);
      expect(result).toEqual(true);
    });
  });

  describe('isEndToEndPracticeTest', () => {
    const testState: TestsModel = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: { 12345: TestStatus.Decided },
    };

    it('should return false when no tests started', () => {
      const result = isEndToEndPracticeTest(testState);
      expect(result).toEqual(false);
    });

    it('should return false when slot id is numeric', () => {
      testState.currentTest.slotId = '1';
      const result = isEndToEndPracticeTest(testState);
      expect(result).toEqual(false);
    });

    it('should return true when slot id starts with practice', () => {
      testState.currentTest.slotId = end2endPracticeSlotId;
      const result = isEndToEndPracticeTest(testState);
      expect(result).toEqual(true);
    });
  });

  describe('getActivityCodeBySlotId', () => {
    it('should return a valid activity code if available', () => {
      const testState: TestsModel = {
        currentTest: { slotId: null },
        startedTests: {
          1234: {
            category: 'B',
            activityCode: ActivityCodes.ACCIDENT,
            journalData: null,
            rekey: false,
            changeMarker: false,
            examinerBooked: 1,
            examinerConducted: 1,
            examinerKeyed: 1,
          },
        },
        testStatus: {},
      };
      const result = getActivityCodeBySlotId(testState, 1234);
      expect(result).toEqual(ActivityCodes.ACCIDENT);
    });
    it('should return undefined if no activity code yet', () => {
      const testState: TestsModel = {
        currentTest: { slotId: null },
        startedTests: {
          1234: null,
        },
        testStatus: {},
      };
      const result = getActivityCodeBySlotId(testState, 1234);
      expect(result).toBeNull();
    });
  });

});
