import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DigitalUse } from 'src/app/models/use';
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

  constructor(
    private location:Location,
    private control: RemoteControlService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    public basket: BasketService,
  ) { }

  private controlSetup(){
    this.control.showControls = false;
    this.control.showLogo = false;
    this.control.titleColor = 'text-800'
    let state = this.location.getState() as any;
    this.control.title = `Fiche ${state['itemName']}`;
  }

  ngOnInit(): void {

    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      this.coreService.getDigitalUse(uuid, {
        expand: ['services', 'services.area'],
        omit: ['items', 'item_ids', 'services.use', 'service.use_id'],
      }).subscribe(use => {
        this.use = use
      });
    });
  }
}
