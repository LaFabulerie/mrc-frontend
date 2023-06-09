import { Location } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/use';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-bathroom',
  templateUrl: './bathroom.component.svg',
  styleUrls: ['./bathroom.component.scss']
})
export class BathroomComponent implements OnInit{

  room: Room = {} as Room;

  constructor(
    private location: Location,
    private control: RemoteControlService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.control.showControls = true;
    this.control.transparentNavigation = true;
    this.control.showLogo = false;
    this.control.currentBackUrl = '/map';

    this.room = this.location.getState() as Room;

    this.control.navigateToRoom$.subscribe(uuid => {
      if(!uuid) return;
      const item = this.room.items.find(r => r.uuid == uuid);
      this.router.navigateByUrl('/item', { state: {item: item, color: this.room.mainColor}});
    })

  }

  goToItem(uuid: string){
    this.router.navigate(['/item', uuid], { state: {back : 'bathroom'} });
  }

}
