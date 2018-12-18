import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

// import { JournalTestDetailsComponent } from './journal-test-details/journal-test-details';
import { JournalTimeComponent} from './journal-time/journal-time';
import { JournalCandidateComponent} from './journal-candidate/journal-candidate';

@NgModule({
	declarations: [JournalTimeComponent, JournalCandidateComponent],
	imports: [IonicModule],
	exports: [JournalTimeComponent, JournalCandidateComponent]
})
export class JournalComponentsModule {}