import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NonPassFinalisationPage } from './non-pass-finalisation';
import { AnalyticsProvider } from '../../../providers/analytics/analytics';
import { ComponentsModule } from '../../../components/common/common-components.module';
import { TestFinalisationComponentsModule } from '../components/test-finalisation.module';

@NgModule({
  declarations: [
    NonPassFinalisationPage,
  ],
  imports: [
    IonicPageModule.forChild(NonPassFinalisationPage),
    ComponentsModule,
    TestFinalisationComponentsModule,
  ],
  providers: [
    AnalyticsProvider,
  ],
})
export class NonPassFinalisationPageModule { }
