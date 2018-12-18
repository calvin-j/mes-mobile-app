import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JournalPage } from './journal';
import { JournalComponentsModule } from './journal-components/journal-components.module';

@NgModule({
  declarations: [
    JournalPage,
  ],
  imports: [
    IonicPageModule.forChild(JournalPage),
    JournalComponentsModule,
  ],
})
export class JournalPageModule {}
