import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JournalProvider } from '../journal';
import { AuthenticationProvider } from '../../authentication/authentication';
import { AuthenticationProviderMock } from '../../authentication/__mocks__/authentication.mock';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { NetworkStateProvider } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { SecureStorageMock } from '@ionic-native-mocks/secure-storage';
import { SecureStorage } from '@ionic-native/secure-storage';
import { Network } from '@ionic-native/network';
import { NetworkMock } from 'ionic-mocks';
import { DateTime, Duration } from '../../../shared/helpers/date-time';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { DateTimeProvider } from '../../date-time/date-time';
import { DateTimeProviderMock } from '../../date-time/__mocks__/date-time.mock';

describe('JournalProvider', () => {

  let journalProvider: JournalProvider;
  let httpMock: HttpTestingController;
  let authProviderMock: AuthenticationProvider;
  let urlProviderMock: UrlProvider;
  let dataStoreMock: DataStoreProvider;
  let appConfigProviderMock: AppConfigProvider;
  let cacheDays: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        JournalProvider,
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: Network, useClass: NetworkMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
      ],
    });

    httpMock = TestBed.get(HttpTestingController);
    journalProvider = TestBed.get(JournalProvider);
    authProviderMock = TestBed.get(AuthenticationProvider);
    urlProviderMock = TestBed.get(UrlProvider);
    dataStoreMock = TestBed.get(DataStoreProvider);
    appConfigProviderMock = TestBed.get(AppConfigProvider);
    cacheDays = appConfigProviderMock.getAppConfig().daysToCacheJournalData;

  });

  describe('isCacheTooOld', () => {
    it(`should return true if date is greater than cacheDays days ago`, () => {
      const today = new DateTime();
      const tooOld = new DateTime().add(-(cacheDays + 1), Duration.DAY);
      expect(journalProvider.isCacheTooOld(tooOld, today)).toBe(true);
    });

    it(`should return true if date is less than or equal to cacheDays days ago`, () => {
      const today = new DateTime();
      const withinWindow = new DateTime().add(-cacheDays, Duration.DAY);
      expect(journalProvider.isCacheTooOld(withinWindow, today)).toBe(false);
    });
  });

  describe('getAndConvertOfflineJournal', () => {
    it('should empty cached data if cache is too old', () => {
      const exampleSchedule: ExaminerWorkSchedule = {
        examiner: { staffNumber: '1234' },
      };
      const agedCache = {
        dateStored: new DateTime().add(-(cacheDays + 1), Duration.DAY).format('YYYY/MM/DD'),
        data: exampleSchedule,
      };

      // override mock getItem as we need data to test
      // @ts-ignore
      dataStoreMock.getItem.and.callFake(() => Promise.resolve(JSON.stringify(agedCache)));

      spyOn(journalProvider, 'emptyCachedData').and.callThrough();

      journalProvider.getAndConvertOfflineJournal().then((data) => {
        expect(journalProvider.emptyCachedData).toHaveBeenCalled();
        expect(dataStoreMock.setItem).toHaveBeenCalled();
        expect(data).toEqual({} as ExaminerWorkSchedule);
      });
    });

    it('should return data without emptying cache if data is not too old', () => {
      const exampleSchedule: ExaminerWorkSchedule = {
        examiner: { staffNumber: '1234' },
      };
      const dataWthinWindowCache = {
        dateStored: new DateTime().add(cacheDays, Duration.DAY).format('YYYY/MM/DD'),
        data: exampleSchedule,
      };

      // override mock getItem as we need data to test
      // @ts-ignore
      dataStoreMock.getItem.and.callFake(() => Promise.resolve(JSON.stringify(dataWthinWindowCache)));

      spyOn(journalProvider, 'emptyCachedData').and.callThrough();

      journalProvider.getAndConvertOfflineJournal().then((data) => {
        expect(journalProvider.emptyCachedData).toHaveBeenCalledTimes(0);
        expect(dataStoreMock.setItem).toHaveBeenCalledTimes(0);
        expect(data).toEqual(dataWthinWindowCache.data);
      });
    });

  });

  describe('getJournal', () => {
    it('should obtain the personal journal URL from the journal provider, passing the cached employee ID', () => {
      journalProvider.getJournal(null).subscribe();

      httpMock.expectOne('https://www.example.com/api/v1/journals/12345678/personal');
      expect(authProviderMock.getEmployeeId).toHaveBeenCalled();
      expect(authProviderMock.isInUnAuthenticatedMode).toHaveBeenCalled();
      expect(urlProviderMock.getPersonalJournalUrl).toHaveBeenCalledWith('12345678');
    });
  });
});
