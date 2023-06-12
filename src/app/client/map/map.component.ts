import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private control: RemoteControlService,
  ) {
  }

  private controlSetup() {
    this.control.showControls = true;
    this.control.showLogo = true;
    this.control.title = '';
    this.control.currentBackUrl = ''
    this.control.bgColor = '#17ada9';
  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  goToRoom(roomName: string, uuid: string){
    const url = ['room', roomName, uuid]
    const state = { back: this.router.url }
    this.control.navigateTo(url, state);
    this.router.navigate(url, {state: state});
  }
}
