import { Location } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DigitalUse, Item } from 'src/app/models/use';
import { User } from 'src/app/models/user';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  item?: Item;
  user?: User;

  useGrid: (DigitalUse|undefined)[][] = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];

  constructor(
    private location:Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private control: RemoteControlService,
    private renderer: Renderer2,
    private coreService: CoreService,
  ) {
  }

  ngOnInit(): void {
    this.control.showControls = true;
    this.control.showLogo = false;
    this.control.transparentNavigation = true;

    let state = this.location.getState() as any;
    this.control.currentBackUrl = `/room/${state['back']}`

    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      this.coreService.getItem(uuid, {
        expand: ['uses', 'room'],
        fields: ['name', 'uses', 'room.uuid', 'room.main_color', 'image', 'uuid']
      }).subscribe(item => {
        this.item = item
        this.renderer.setStyle(document.body, 'background-color', item.room.mainColor);
        if(this.item){
          this.useGrid = [
            [this.item.uses[9], this.item.uses[0], this.item.uses[6]],
            [this.item.uses[5], undefined, this.item.uses[2]],
            [this.item.uses[3], undefined, this.item.uses[4]],
            [this.item.uses[8], this.item.uses[1], this.item.uses[7]],
          ];
        }
      })
    })


    this.control.navigateToDigitalUse$.subscribe(uuid => {
      if(!uuid && !this.item) return;
      const use = this.item!.uses.find(r => r.uuid == uuid);
      this.router.navigateByUrl('/use', { state: use });
    })
  }

  goToDigitalUse(uuid: string){
    this.router.navigate(['/use', uuid], { state: {back : this.item?.uuid, itemName: this.item?.name} });
  }
}
