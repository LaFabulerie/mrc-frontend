import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DigitalUse } from 'src/app/models/use';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-digital-use',
  templateUrl: './digital-use.component.html',
  styleUrls: ['./digital-use.component.scss']
})
export class DigitalUseComponent {
  use: DigitalUse = {} as DigitalUse;
  constructor(
    private location:Location,
    private control: RemoteControlService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.control.showControls = false;
    this.control.showLogo = false;
    this.control.transparentNavigation = true;

    let state = this.location.getState() as any;
    this.control.currentBackUrl = `/item/${state['back']}`
    this.control.title = `Fiche ${state['itemName']}`;

    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      this.coreService.getDigitalUse(uuid, {
        omit: ['items', 'item_ids'],
      }).subscribe(use => {
        this.use = use
      });
    });
  }
}
