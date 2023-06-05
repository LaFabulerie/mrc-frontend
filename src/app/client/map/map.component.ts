import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/use';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-map',
  templateUrl: './plan.component.svg',
  styleUrls: ['./map.component.scss']
})
export class MapComponent  implements OnInit{

  rooms: Room[] = [];
  navigationMode: string|undefined = undefined;

  user?: User;

  constructor(
    private coreService: CoreService,
    private router: Router,
    private control: RemoteControlService,
    private auth: AuthService,
  ) {
    this.user = this.auth.userValue;

    this.control.enableNavigation();
    this.control.transparentNavigation = false;

    this.control.navitationMode$.subscribe((v) => {
      if(v) {
        this.navigationMode = v
      }
    });
  }

  ngOnInit(): void {
    this.coreService.fetchFullRooms()

    this.control.navigateToRoom$.subscribe(roomName => {
      if(!roomName) return;
      this.goToRoom(roomName)
    })
  }

  goToRoom(roomName: string, uuid?: string){
    this.router.navigateByUrl(`/room/${roomName}`);
  }
}
