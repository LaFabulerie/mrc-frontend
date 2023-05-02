import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item, Room } from 'src/app/models/use';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  room: Room = {} as Room;
  navigationMode: string|undefined = undefined;

  user?: User;

  constructor(
    private location:Location,
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
    this.room = this.location.getState() as Room;

    this.control.navigateToRoom$.subscribe(uuid => {
      if(!uuid) return;
      const item = this.room.items.find(r => r.uuid == uuid);
      this.router.navigateByUrl('/item', { state: item });
    })
  }

  goToItem(item: Item){
    if(this.navigationMode == "master"){
      this.control.navigate('item', item.uuid);
    } else {
      this.router.navigateByUrl('/item', { state: item });
    }
  }

}
