import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '../../../../providers/outcome-behaviour-map/outcome-behaviour-map';

@Component({
  selector: 'candidate-description',
  templateUrl: 'candidate-description.html',
})
export class CandidateDescriptionComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  candidateDescription: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  candidateDescriptionChange = new EventEmitter<string>();

  private formControl: FormControl;
  static readonly fieldName: string = 'candidateDescription';
  candidateDescriptionCharsRemaining: number = null;

  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl(CandidateDescriptionComponent.fieldName, this.formControl);
    }
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome,
      CandidateDescriptionComponent.fieldName);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(CandidateDescriptionComponent.fieldName).clearValidators();
    } else {
      this.formGroup.get(CandidateDescriptionComponent.fieldName).setValidators([
        Validators.required, Validators.maxLength(1000)]);
    }
    this.formControl.patchValue(this.candidateDescription);
  }

  candidateDescriptionChanged(candidateDescription: string): void {
    this.candidateDescriptionChange.emit(candidateDescription);
  }

  characterCountChanged(charactersRemaining: number) {
    this.candidateDescriptionCharsRemaining = charactersRemaining;
  }

  getCharacterCountText() {
    const characterString = Math.abs(this.candidateDescriptionCharsRemaining) === 1 ? 'character' : 'characters';
    const endString = this.candidateDescriptionCharsRemaining < 0 ? 'too many' : 'remaining';
    return `You have ${Math.abs(this.candidateDescriptionCharsRemaining)} ${characterString} ${endString}`;
  }

  charactersExceeded(): boolean {
    return this.candidateDescriptionCharsRemaining < 0;
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
