import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { IEnvironment } from '../../environment/environment.model';
import { Observable } from 'rxjs';

@Injectable()
export class AppConfigDynamicProvider implements IEnvironment {
  isRemote: boolean;
  journalApiUrl: string;
  googleAnalyticsId: string;
  userIdDimensionIndex: number;
  dynamicAppSettingsUrl: string;

  constructor(private httpClient: HttpClient) {}

  getJournalApiUrl(): string {
    return this.journalApiUrl;
  }

  getGoogleAnalyticsKey(): string {
    return this.googleAnalyticsId;
  }

  getGoogleAnalyticsUserIdDimension(): number {
    return this.userIdDimensionIndex;
  }

  refreshConfigSettings(): Observable<any> {
    this.readEnvironments();
    if (this.isRemote) {
      return this.getRemoteData();
    }
  }

  getRemoteData(): Observable<any> {
    return this.httpClient.get<any>(this.dynamicAppSettingsUrl).map((res) => {
      this.googleAnalyticsId = res.body.data.googleAnalyticsId;
      this.userIdDimensionIndex = res.body.data.userIdDimensionIndex;
      this.journalApiUrl = res.body.data.journalApiUrl;
      return;
    });
  }

  readEnvironments() {
    this.isRemote = environment.isRemote;
    this.dynamicAppSettingsUrl = environment.remoteSettingsUrl;
    this.journalApiUrl = environment.journalApiUrl;
    this.googleAnalyticsId = environment.googleAnalyticsId;
    this.userIdDimensionIndex = environment.userIdDimensionIndex;
  }
}
