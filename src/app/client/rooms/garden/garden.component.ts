import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';
import { BaseRoomComponent } from '../room.component';

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.svg',
  styleUrls: ['../room.component.scss']
})
export class GardenComponent extends BaseRoomComponent implements OnInit{

  constructor(
    control: RemoteControlService,
    activatedRoute: ActivatedRoute,
    coreService: CoreService,
  ) {
    super(control, activatedRoute, coreService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
