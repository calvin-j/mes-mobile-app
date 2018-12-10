import { Component, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { signaturePadOptions } from './mes-signature-pad.options';

@Component({
  selector: 'mes-signature-pad',
  templateUrl: 'mes-signature-pad.html'
})
export class MesSignaturePadComponent {
  signature: string;
  options: any;
  @ViewChild(SignaturePad)
  signaturePad: SignaturePad;

  constructor() {
    this.options = signaturePadOptions;
  }

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    this.signaturePad.resizeCanvas();
  }

  clear() {
    this.signaturePad.clear();
    this.signature = null;
  }

  drawComplete() {
    this.signature = this.signaturePad.toDataURL();
  }

  getSignature() {
    return this.signature;
  }
}
