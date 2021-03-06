import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppConfigProvider } from '../app-config';

import { environmentResponseMock } from '../__mocks__/environment-response.mock';
import { remoteEnvironmentMock } from '../__mocks__/environment.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { Platform } from 'ionic-angular';
import { PlatformMock } from 'ionic-mocks';
import { StoreModule, Store } from '@ngrx/store';
import { LogHelper } from '../../logs/logsHelper';
import { Device } from '@ionic-native/device';
import { LogHelperMock } from '../../logs/__mocks__/logsHelper.mock';

describe('App Config Provider', () => {

  let appConfig: AppConfigProvider;
  let httpMock: HttpTestingController;
  let platform: Platform;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProvider, environmentFile: remoteEnvironmentMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        Store,
        { provide: LogHelper, useClass: LogHelperMock },
        Device,
      ],
    });

    appConfig = TestBed.get(AppConfigProvider);
    httpMock = TestBed.get(HttpTestingController);
    platform = TestBed.get(Platform);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialiseAppConfig', () => {
    it('should run loadMangedConfig() when platform is Ios', () => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(true);
      appConfig.loadManagedConfig = jasmine.createSpy('appConfig.loadManagedConfig');

      appConfig.initialiseAppConfig();

      expect(appConfig.loadManagedConfig).toHaveBeenCalled();
    });
    it('should not run loadMangedConfig() when platform is not ios', () => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(false);
      appConfig.loadManagedConfig = jasmine.createSpy('appConfig.loadManagedConfig');

      appConfig.initialiseAppConfig();

      expect(appConfig.loadManagedConfig).toHaveBeenCalledTimes(0);
    });
  });

  describe('loadRemoteConfig', () => {
    it('should load remote config', fakeAsync(() => {
      appConfig.environmentFile = remoteEnvironmentMock;

      appConfig.loadRemoteConfig();
      tick();

      const request = httpMock.expectOne(remoteEnvironmentMock.configUrl);
      expect(request.request.method).toBe('GET');
      request.flush(environmentResponseMock);
    }));
  });

  describe('loadMangedConfig', () => {
    it('should load managed config and update environmentFile', () => {
      appConfig.loadManagedConfig();

      expect(appConfig.environmentFile.configUrl).toBe('AppConfigMock');
    });
  });
});
