import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/use';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  room: Room = {} as Room;
  constructor(
    private location:Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.room = this.location.getState() as Room;
  }

  goToItem(item: any) {
    this.router.navigateByUrl('/item', { state: item });
  }

}
