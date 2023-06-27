import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/use';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-map',
  templateUrl: './plan.component.svg',
  styleUrls: ['./map.component.scss']
})
export class MapComponent  implements OnInit{

  rooms: Room[] = [];
  showBathroom: boolean = false;
  showBedroom: boolean = false;

  constructor(
    private control: RemoteControlService,
  ) {
    this.controlSetup();
  }

  private controlSetup() {
    this.control.showMapButton = false;
    this.control.showBackButton = false;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.showLogo = true;
    this.control.title = '';
    this.control.navigationBgColor = 'bg-trasparent'
    this.control.bgColor = '#17ada9';
  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  goToRoom(roomName: string, uuid: string){
    this.control.navigate(['room', roomName, uuid]);
  }
}
