import { EnvironmentFile } from './models/environment.model';

export const environment: EnvironmentFile = {
  isRemote: true,
  configUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/configuration/prod',
  daysToCacheJournalData: 14,
  daysToCacheLogs: 7,
  enableDevTools: false,
  logsPostApiKey: '',
  logsApiUrl: '',
  logsAutoSendInterval: 6000,
  authentication: {
    context: '',
    resourceUrl: '',
    clientId: '',
    redirectUrl: '',
    logoutUrl: '',
    employeeIdKey: '',
  },
};
