import { IAnalyticsProvider } from '../analytics.model';

export class AnalyticsProviderMock implements IAnalyticsProvider {

  googleAnalyticsKey: string = 'UA-12345678';
  /**
   * @param  {string} name
   * @returns void
   */
  setCurrentPage(name: string):void {}
  /**
   * @returns Promise
   */
  initialiseAnalytics = (): Promise<any> =>
    new Promise((resolve) => {
      resolve();
    })
  /**
   * @param  {string} category
   * @param  {string} event
   * @param  {any} params?
   */
  logEvent(category: string, event: string, params?: any) {}
  /**
   * @param  {number} key
   * @param  {string} value
   */
  addCustomDimension(key: number, value: string) {}
  /**
   * @param  {string} message
   */
  logError(message: string) {}
  /**
   * @param  {string} message
   * @param  {boolean} fatal
   */
  logException(message: string, fatal: boolean) {}
  /**
   * @param  {string} userId
   */
  setUserId(userId: string) {}
}
