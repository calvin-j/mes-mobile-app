import { Observable } from 'rxjs/Observable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';

export class InAppBrowserMock {

  create(url: string, target: string, options: string) {
    return new InAppBrowserObjectMock();
  }
}

export class InAppBrowserObjectMock {
  /**
   * @returns void
   */
  show(): void {}
  /**
   * @returns void
   */
  close(): void { }
  /**
   * @returns void
   */
  hide(): void { }
  /**
   * @param  {object} script
   * @returns Promise
   */
  executeScript(script: object): Promise<any> {
    return new Promise((resolve) => { });
  }
  /**
   * @param  {object} css
   * @returns Promise
   */
  insertCSS(css: object): Promise<any> {
    return new Promise((resolve) => { });
  }
  /**
   * @param  {string} event
   * @returns Observable
   */
  on(event: string): Observable<InAppBrowserEventMock> {
    return new EmptyObservable();
  }
}

export class InAppBrowserEventMock {

  type: string = 'type';
  url: string = 'url';
  code: number = 123;
  message: string = 'message';
}
