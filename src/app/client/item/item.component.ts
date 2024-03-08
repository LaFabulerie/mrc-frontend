import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/models/core';
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
    this.control.navBarEnabled = true;
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
  }

  ngOnInit(): void {

    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      this.coreService.items$.subscribe(items => {
        if(!items || items.length == 0) return;
        this.item = items.find(item => item.uuid === uuid);
        this.control.currentItem= this.item;
        this.useList = [...this.item!.uses];
        const limit = 10 - this.useList.length;
        for(let i=0; i<=limit; i++){
          this.useList.push(null);
        }
        this.renderer.setStyle(document.body, 'background-color', this.item!.room.mainColor);
      });
    })
  }

  goToDigitalUse(uuid: string){
    const scope = this.activatedRoute.snapshot.params['scope'];
    this.control.navigate(scope? ['use', scope, uuid] : ['use', uuid], { itemName: this.item?.name });
  }

  mouseEnterUse(event: any, activated: boolean){
    if(activated){
      // https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
      event.target.style.backgroundColor = this.item?.room.mainColor + '54';
    }
  }

  mouseLeaveUse(event: any){
    event.target.style.backgroundColor = 'transparent';
  }
}
