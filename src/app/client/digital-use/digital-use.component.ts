import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DigitalService, DigitalUse } from 'src/app/models/core';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-digital-use',
  templateUrl: './digital-use.component.html',
  styleUrls: ['./digital-use.component.scss']
})
export class DigitalUseComponent {
  use!: DigitalUse;
  services: any[] = []

  constructor(
    private control: RemoteControlService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    public basket: BasketService,
  ) { }

  private controlSetup(){
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.bgColor = '#EEEEEE';
  }

  ngOnInit(): void {

    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      const scope = params['scope'];
      this.coreService.digitalUses$.subscribe(uses => {
        this.use = uses.find(use => use.uuid === uuid)!;
        this.services = scope ? this.use.services.filter(
            service => service.scope === 'National' || service.scope.split(",").includes(scope)
        ) : this.use.services;
      });
    });
  }
}
