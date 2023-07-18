import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.svg',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent  implements OnInit{

  constructor(
    private control: RemoteControlService,
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
  ) {
  }

  private controlSetup() {
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.showLogo = true;
    this.control.title = '';

  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      this.coreService.getRoom(uuid, {
        fields: ["video"]
      }).subscribe(room => {
        // this.control.openDialog(VideoDialogComponent, {
        //   videoURL: room.video
        // });
      })
    });
  }

  goToItem(uuid: string){
    this.control.navigate(['item', uuid]);
  }

}
