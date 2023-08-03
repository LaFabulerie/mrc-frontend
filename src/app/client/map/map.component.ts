import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/core';
import { RemoteControlService } from 'src/app/services/control.service';
import { DisclaimerDialogComponent } from '../components/disclaimer-dialog/disclaimer-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.svg',
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
    this.control.bgColor = '#17ada9';
  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  goToRoom(roomName: string, uuid: string){
    if(environment.mode === 'standalone'){
      this.control.openDialog(DisclaimerDialogComponent, {
        next: ['room', roomName, uuid]
      });
    } else {
      this.control.navigate(['room', roomName, uuid]);
    }

  }
}
