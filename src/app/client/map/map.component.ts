import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/use';
import { User } from 'src/app/models/user';
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
    this.control.showControls = true;
    this.control.transparentNavigation = false;
    this.control.currentBackUrl = ''
  }

  ngOnInit(): void {
    this.control.navigateToRoom$.subscribe(roomName => {
      if(!roomName) return;
      this.goToRoom(roomName)
    })
  }

  goToRoom(roomName: string, uuid?: string){
    this.router.navigateByUrl(`/room/${roomName}`);
  }
}
