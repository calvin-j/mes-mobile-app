import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeComponent } from '../time';
import { IonicModule } from 'ionic-angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


describe('TimeComponent', () => {
  let component: TimeComponent;
  let fixture: ComponentFixture<TimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeComponent],
      imports: [IonicModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TimeComponent);
        component = fixture.componentInstance;
        component.time =  '2018-12-10T10:04:00+00:00';
        component.testComplete = true;
      });
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('DOM', () => {
    let componentEl: DebugElement;

    beforeEach(() => {
      componentEl = fixture.debugElement;
    });

    describe('Time output ', () => {
      it('should be displayed', () => {
        const timeSpan: HTMLElement = componentEl.query(By.css('ion-row:first-child h2'))
          .nativeElement;
        fixture.detectChanges();
        expect(timeSpan.textContent).toBe('10:04');
      });
    });

    describe('class if test complete ', () => {
      it('should be time-test-complete-text', () => {
        fixture.detectChanges();
        const timeSpan: any = componentEl.query(By.css('ion-row:first-child h2'));
        expect(timeSpan.classes['time-test-complete-text']).toBeTruthy();
      });
    });
  });
});
