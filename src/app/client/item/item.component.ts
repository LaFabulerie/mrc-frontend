import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Nullable } from 'primeng/ts-helpers';
import { DigitalUse, Item } from 'src/app/models/use';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  item?: Item;
  useList: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private control: RemoteControlService,
    private renderer: Renderer2,
    private coreService: CoreService,
  ) {
    this.controlSetup();
  }

  private controlSetup() {
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.showLogo = true;
    this.control.title = "";
    this.control.titleColor = 'text-200'
  }

  ngOnInit(): void {

    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      this.coreService.getItem(uuid, {
        expand: ['uses', 'room'],
        fields: ['name', 'uses', 'room.uuid', 'room.main_color', 'image', 'uuid']
      }).subscribe(item => {
        this.item = item
        this.useList = [...item.uses];
        const limit = 10-this.useList.length
        for(let i=0; i<=limit; i++){
          this.useList.push(null);
        }
        this.renderer.setStyle(document.body, 'background-color', item.room.mainColor);
      })
    })
  }

  goToDigitalUse(uuid: string){
    this.control.navigate(['use', uuid], { itemName: this.item?.name });
  }
}
