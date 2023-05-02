import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DigitalUse } from 'src/app/models/use';

@Component({
  selector: 'app-digital-use',
  templateUrl: './digital-use.component.html',
  styleUrls: ['./digital-use.component.scss']
})
export class DigitalUseComponent {
  use: DigitalUse = {} as DigitalUse;
  constructor(
    private location:Location,
  ) { }

  ngOnInit(): void {
    this.use = this.location.getState() as DigitalUse;
  }
}
