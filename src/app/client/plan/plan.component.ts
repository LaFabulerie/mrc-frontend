import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/use';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
})
export class PlanComponent  implements OnInit{

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

    this.control.navitationMode$.subscribe((v) => {
      if(v) {
        this.navigationMode = v
      }
    });
  }

  ngOnInit(): void {
    this.coreService.getRooms({
      expand: ['items','items.room', 'items.uses', 'items.uses.services', 'items.uses.services.area'],
      omit: ['items.room.items', 'items.uses.items' ]
    }).subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    });

    this.control.navigateToRoom$.subscribe(uuid => {
      if(!uuid) return;
      const room = this.rooms.find(r => r.uuid == uuid);
      this.router.navigateByUrl('/room', { state: room });
    })
  }

  goToRoom(room: Room){
    if(this.navigationMode == "master"){
      this.control.navigate('room', room.uuid);
    } else {
      this.router.navigateByUrl('/room', { state: room });
    }
  }
}
