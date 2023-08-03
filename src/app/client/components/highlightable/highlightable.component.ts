import { Component } from '@angular/core';

@Component({
  selector: 'app-highlightable',
  template: '<ng-container>HighlightableComponent</ng-container>',
})
export class HighlightableComponent {

  private _currentHighLight: string = '';

  set currentHighLight(value: string) {
    this._currentHighLight = value;
  }

  activate(value: string) {
    this.currentHighLight = value;
  }

  release(value: string) {
    this.currentHighLight = '';
  }

  isActive(value: string): boolean {
    return this._currentHighLight === value;
  }

}
