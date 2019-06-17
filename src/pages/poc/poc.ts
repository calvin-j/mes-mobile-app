import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  Platform,
} from 'ionic-angular';

import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { BasePageComponent } from '../../shared/classes/base-page';
import { EmailComposer } from '@ionic-native/email-composer';
import * as pdfTemplate from './poc.template';
import * as _ from 'lodash';
declare var cordova:any;    // global;

@IonicPage()
@Component({
  selector: 'page-poc',
  templateUrl: 'poc.html',
})
export class Poc extends BasePageComponent {

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    private emailComposer : EmailComposer,
  ) {
    super(platform, navCtrl, authenticationProvider, false);
  }

  sendEmailWithBase64(base64 : string, mailClient: string, template: string) {
    // this.emailComposer.addAlias('outlook', 'com.microsoft.outlook');

    // Please change these values accordingly, also you can change the attachment PDF name
    // For future requirements, base64 parameter can be a list of base64s, attach multiple PDFs to email
    const email = {
      to: 'natalie.johnson@bjss.com',
      subject: 'Test Results',
      // body: '<h1>Title</h1>This is the <b>body</b> of the email',
      body: template,
      attachments: [
        // 'file://assets/imgs/journal/exclamation-indicator.png',
        `base64:testResults.pdf//${base64}`,
      ],
      isHtml: true,
      app: mailClient === 'outlook' ? 'outlook' : 'mailto',
    };

    this.emailComposer.open(email);
  }

  generatePdfAndSendEmailOutlook() {
    this.generatePdfAndSendEmail('outlook');
  }

  generatePdfAndSendEmail(mailClient) {
    // Used to configure the type of PDF, document size can be one of A4, A3, A2
    const options = {
      documentSize: 'A4',
      type: 'base64',
    };

    // This object will be populated into the placeholders within the HTML template, add more values or
    // or use an existing object to populate the HTML template
    const objectToBePopulatedIntoTemplate = {
      candidateName: 'Morgan Jones',
      driverNumber: 'JONES370122DRM11',
      testResult: 'Passed',
    };
    const compiledTemplate = _.template(pdfTemplate.template)(objectToBePopulatedIntoTemplate);
    cordova.plugins.pdf.fromData(compiledTemplate , options)
      .then((base64) => {
        this.sendEmailWithBase64(base64, mailClient, compiledTemplate);
      })
      .catch(err => console.log(err));
  }

}
