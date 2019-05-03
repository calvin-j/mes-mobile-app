import { TestBed } from '@angular/core/testing';
import { TestResultProvider } from '../test-result';

describe('TestResultCalculatorProvider', () => {

  let testResultProvider: TestResultProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestResultProvider,
      ],
    });

    testResultProvider = TestBed.get(TestResultProvider);
  });

  describe('calculateCatBTestResult', () => {
    it('should return a Pass', () => {
      expect(testResultProvider.calculateCatBTestResult({})).toBe('1');
    });
  });
});
