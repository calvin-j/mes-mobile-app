import { Component, Input } from '@angular/core';
import { SlotComponent } from '../slot/slot';
import { isNil } from 'lodash';
import { Activity, activities } from '../../../../providers/slot-selector/activity.constants';

@Component({
  selector: 'activity-slot',
  templateUrl: 'activity-slot.html',
})
export class ActivitySlotComponent implements SlotComponent {
  @Input()
  slot: any;

  @Input()
  hasSlotChanged: boolean;

  @Input()
  showLocation: boolean;

  constructor() {}
  /**
   * @returns string
   */
  formatActivityCode(): string {
    const activityCode = this.slot.activityCode;
    if (isNil(activityCode)) {
      return '0';
    }
    return activityCode.replace(/^\w*0/, '');
  }
  /**
   * @returns string
   */
  public getTitle(): string {
    const activityCode = this.slot.activityCode;
    const matchingActivity: Activity = activities.find(a => a.activityCode === activityCode);
    if (matchingActivity) {
      return matchingActivity.displayName || matchingActivity.description;
    }
    return 'Unknown';
  }
  /**
   * @returns boolean
   */
  public isTravelSlot(): boolean {
    return this.slot.activityCode === '091';
  }

}
