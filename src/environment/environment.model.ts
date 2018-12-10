export interface IEnvironment {
  isRemote: boolean;
  journalApiUrl: string;
  googleAnalyticsId: string;
  userIdDimensionIndex: number;
  dynamicAppSettingsUrl: string;
  getJournalApiUrl(): string;
  getGoogleAnalyticsKey(): string;
  getGoogleAnalyticsUserIdDimension(): number;
}
